import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { emotionColors } from '../utils/constants.js';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function HuMapboxGlobe({ data, view, emotions, country }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const rotationRef = useRef({ rotating: true, frame: null });

  useEffect(() => {
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      center: [0, 20],
      zoom: 1.2,
    });

    map.on('style.load', () => {
      map.setFog({});
    });

    map.on('mousedown', () => {
      rotationRef.current.rotating = false;
    });

    function rotate() {
      if (!rotationRef.current.rotating) return;
      const bearing = map.getBearing() + 0.2;
      map.rotateTo(bearing, { duration: 1000 });
      rotationRef.current.frame = requestAnimationFrame(rotate);
    }
    rotate();

    mapRef.current = map;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer(layer => {
      if (layer.id.startsWith('point-')) map.removeLayer(layer.id);
    });
    Object.keys(map.style._layers || {}).forEach(() => {});
    map.getStyle().layers
      .filter(l => l.id.startsWith('point-'))
      .forEach(l => map.removeLayer(l.id));

    const existingSources = Object.keys(map.style.sourceCaches || {});
    existingSources
      .filter(id => id.startsWith('point-'))
      .forEach(id => map.removeSource(id));

    const filtered = data.filter(item => {
      const matchType = item.type === view;
      const matchEmotion = emotions.length === 0 || emotions.includes(item.emotion);
      const matchCountry = !country || item.country === country;
      return matchType && matchEmotion && matchCountry;
    });

    filtered.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = emotionColors[item.emotion] || '#000';
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.borderRadius = '50%';
      new mapboxgl.Marker(el).setLngLat(item.coordinates).addTo(map);
    });
  }, [data, view, emotions, country]);

  return <div ref={mapContainer} className="map-container" />;
}
