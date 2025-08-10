import { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppState } from '@/context/AppContext';
import { emotionHex } from '@/utils/constants';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const dayFactorLocal = () => {
  const d = new Date();
  const t = d.getHours() + d.getMinutes() / 60;
  const k = Math.cos(((t - 12) * Math.PI) / 12);
  return Math.max(0, 1 - (k + 1) / 2);
};

export const Globe = () => {
  const { contents, emotions, selectedCountry, mode, focus } = useAppState();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const features = useMemo(
    () =>
      contents
        .filter(
          c =>
            emotions[c.emotion] &&
            (!selectedCountry || c.country === selectedCountry) &&
            c.type === mode,
        )
        .map(c => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [c.coords.lng, c.coords.lat],
          },
          properties: {
            colorHex: emotionHex[c.emotion] || '#ffffff',
          },
        })),
    [contents, emotions, selectedCountry, mode],
  );

  useEffect(() => {
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: containerRef.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: { name: 'globe' },
      center: [0, 20],
      zoom: 1.8,
      bearing: 0,
      pitch: 0,
      antialias: true,
    });
    mapRef.current = map;

    map.on('style.load', () => {
      map.setFog({
        'horizon-blend': 0.4,
        range: [0.7, 8],
        color: 'rgb(255, 245, 235)',
        'high-color': 'rgb(255, 255, 255)',
        'space-color': 'rgb(15, 25, 40)',
        'star-intensity': 0.6,
      });

      map.addSource('points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
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

      map.on('click', 'unclustered', e => {
        const f = e.features?.[0];
        if (!f) return;
        const [lng, lat] = (f.geometry as any).coordinates;
        map.flyTo({ center: [lng, lat], zoom: 5, speed: 0.9, curve: 1.6 });
      });

      map.on('click', 'clusters', e => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties?.cluster_id;
        (map.getSource('points') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            map.easeTo({ center: (features[0].geometry as any).coordinates, zoom });
          },
        );
      });

      map.on('mouseenter', 'unclustered', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'unclustered', () => {
        map.getCanvas().style.cursor = '';
      });

      let start = performance.now();
      const baseBearing = -(
        new Date().getUTCHours() * 15 + new Date().getUTCMinutes() * 0.25
      );
      let raf: number;
      const animate = (t: number) => {
        const elapsed = (t - start) / 1000;
        const omega = 360 / 86400;
        const bearing = baseBearing + omega * elapsed;
        if (!map.isMoving()) map.setBearing(bearing);

        const d = dayFactorLocal();
        const starIntensity = 0.2 + (1 - d) * 0.8;
        const sunIntensity = 10 + d * 25;
        map.setFog({
          'horizon-blend': 0.45 + d * 0.1,
          range: [0.7, 8],
          color: d > 0.5 ? 'rgb(255, 245, 235)' : 'rgb(220, 230, 255)',
          'high-color': 'rgb(255, 255, 255)',
          'space-color': 'rgb(15, 25, 40)',
          'star-intensity': starIntensity,
        });
        if (map.getLayer('sky')) {
          map.setPaintProperty('sky', 'sky-atmosphere-sun-intensity', sunIntensity);
        }
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      map.once('remove', () => cancelAnimationFrame(raf));
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource('points') as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;
    source.setData({ type: 'FeatureCollection', features });
  }, [features]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCountry) return;
    const pts = contents.filter(c => c.country === selectedCountry);
    if (pts.length) {
      const bounds = new mapboxgl.LngLatBounds();
      pts.forEach(p => bounds.extend([p.coords.lng, p.coords.lat]));
      map.fitBounds(bounds, { padding: 50, duration: 1000 });
    }
  }, [selectedCountry, contents]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    map.flyTo({ center: [focus.lng, focus.lat], zoom: 5, speed: 0.9 });
  }, [focus]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

