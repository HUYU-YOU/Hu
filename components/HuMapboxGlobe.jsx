import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import TopBar from './TopBar.jsx';
import LeftPanel from './LeftPanel.jsx';
import RightPanel from './RightPanel.jsx';
import { emotionColors } from '../utils/constants.js';
import { sampleData } from '../data/sampleData.js';

const PUBLIC_TOKEN =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.V_B6CdrQywqlOg6IaUBjbg';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || PUBLIC_TOKEN;

export default function HuMapboxGlobe() {
  const mapRef = useRef(null);
  const mapContainer = useRef(null);

  const [view, setView] = useState('video');
  const [selectedEmotions, setSelectedEmotions] = useState(
    Object.keys(emotionColors)
  );
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [bias, setBias] = useState(true);
  const [mapStyle, setMapStyle] = useState('light');
  const [theme, setTheme] = useState('light');

  const countries = useMemo(
    () => Array.from(new Set(sampleData.map((d) => d.country))).sort(),
    []
  );

  const filteredData = useMemo(() => {
    return sampleData.filter(
      (d) =>
        d.type === view &&
        selectedEmotions.includes(d.emotion) &&
        (!selectedCountry || d.country === selectedCountry)
    );
  }, [view, selectedEmotions, selectedCountry]);

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: filteredData.map((d) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: d.coordinates },
        properties: {
          id: d.id,
          title: d.title,
          colorHex: emotionColors[d.emotion],
        },
      })),
    }),
    [filteredData]
  );

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
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

    map.on('style.load', () => {
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
  }, [mapStyle, geojson]);

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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource('points');
    if (src) src.setData(geojson);
  }, [geojson]);

  function handleSelect(item) {
    const map = mapRef.current;
    if (!map) return;
    const [lng, lat] = item.coordinates;
    map.flyTo({ center: [lng, lat], zoom: 5, speed: 0.9 });
  }

  return (
    <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
      <TopBar
        view={view}
        setView={setView}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        theme={theme}
        setTheme={setTheme}
      />
      <div style={{ display: 'flex', height: '100vh' }}>
        <LeftPanel
          countries={countries}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          bias={bias}
          setBias={setBias}
        />
        <div ref={mapContainer} style={{ flex: 1 }} />
        <RightPanel
          data={filteredData}
          selectedEmotions={selectedEmotions}
          setSelectedEmotions={setSelectedEmotions}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}

