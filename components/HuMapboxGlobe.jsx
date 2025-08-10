import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { emotionColors } from '../utils/constants.js';

// Fallback public token allows the globe to render even if an env token isn't provided.
// Replace with your own Mapbox token for production use.
const PUBLIC_TOKEN =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.V_B6CdrQywqlOg6IaUBjbg';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || PUBLIC_TOKEN;

function HuMapboxGlobe({ data, view, emotions, country, mapStyle }, ref) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const rotationRef = useRef({ rotating: true, frame: null });

  useEffect(() => {
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        mapStyle === 'satellite'
          ? 'mapbox://styles/mapbox/satellite-streets-v12'
          : 'mapbox://styles/mapbox/light-v11',
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
    const styleUrl =
      mapStyle === 'satellite'
        ? 'mapbox://styles/mapbox/satellite-streets-v12'
        : 'mapbox://styles/mapbox/light-v11';
    map.setStyle(styleUrl);
  }, [mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const update = () => {
      map.eachLayer(layer => {
        if (layer.id.startsWith('point-')) map.removeLayer(layer.id);
      });

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

      filtered.forEach(item => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = emotionColors[item.emotion] || '#000';
        el.style.width = '10px';
        el.style.height = '10px';
        el.style.borderRadius = '50%';
        new mapboxgl.Marker(el).setLngLat(item.coordinates).addTo(map);
      });
    };

    if (!map.isStyleLoaded()) {
      map.once('styledata', update);
    } else {
      update();
    }
  }, [data, view, emotions, country, mapStyle]);

  useImperativeHandle(ref, () => ({
    centerOnUser() {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(pos => {
        const { longitude, latitude } = pos.coords;
        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 4 });
      });
    },
  }));

  return <div ref={mapContainer} className="map-container" />;
}

export default forwardRef(HuMapboxGlobe);
