import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const PUBLIC_TOKEN =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.V_B6CdrQywqlOg6IaUBjbg';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || PUBLIC_TOKEN;

export function useMapboxGlobe({ mapStyle, geojson }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  // initialize map when style changes
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style:
        mapStyle === 'light'
          ? 'mapbox://styles/mapbox/outdoors-v12'
          : 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: { name: 'globe' },
      center: [0, 20],
      zoom: 1.8,
      antialias: true,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.scrollZoom.enable();

    map.on('style.load', () => {
      map.getStyle().layers.forEach((layer) => {
        if (layer.id.includes('boundary')) {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      map.addSource('points', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 6,
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#9bd2ff',
          'circle-radius': ['step', ['get', 'point_count'], 12, 50, 18, 200, 26],
          'circle-opacity': 0.9,
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'points',
        filter: ['has', 'point_count'],
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 },
        paint: { 'text-color': '#003355' },
      });

      map.addLayer({
        id: 'unclustered',
        type: 'circle',
        source: 'points',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'colorHex'],
          'circle-radius': 5,
          'circle-stroke-width': 1.6,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.on('click', 'unclustered', (e) => {
        const [lng, lat] = e.features[0].geometry.coordinates;
        map.flyTo({ center: [lng, lat], zoom: 5, speed: 0.9 });
      });

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('points').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({ center: features[0].geometry.coordinates, zoom });
        });
      });
    });

    return () => map.remove();
  }, [mapStyle]);

  // update data source when geojson changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource('points');
    if (src) src.setData(geojson);
  }, [geojson]);

  // simple auto-rotation
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let frame;
    function rotate() {
      const bearing = map.getBearing() + 0.05;
      map.setBearing(bearing);
      frame = requestAnimationFrame(rotate);
    }
    frame = requestAnimationFrame(rotate);
    map.on('dragstart', () => cancelAnimationFrame(frame));
    map.on('dragend', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(rotate);
    });
    return () => cancelAnimationFrame(frame);
  }, [mapStyle]);

  function flyTo(coords) {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: coords, zoom: 5, speed: 0.9 });
  }

  return { mapRef, mapContainerRef: containerRef, flyTo };
}
