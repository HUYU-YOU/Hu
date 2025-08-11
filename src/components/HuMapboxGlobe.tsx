import { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppState } from '@/context/AppContext';
import { emotionHex } from '@/utils/constants';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const HuMapboxGlobe = () => {
  const { contents, emotions, selectedCountry, mode, focus } = useAppState();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const points = useMemo(
    () =>
      contents
        .filter(
          c =>
            emotions[c.emotion] &&
            (!selectedCountry || c.country === selectedCountry) &&
            c.type === mode,
        )
        .map(c => ({
          lat: c.coords.lat,
          lng: c.coords.lng,
          color: emotionHex[c.emotion] || '#ffffff',
        })),
    [contents, emotions, selectedCountry, mode],
  );

  useEffect(() => {
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: containerRef.current as HTMLElement,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: { name: 'globe' },
      center: [0, 20],
      zoom: 1.5,
    });

    map.on('style.load', () => {
      map.addSource('points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
      });
    });

    let frame: number;
    const rotate = () => {
      if (!map.isMoving()) {
        const b = map.getBearing();
        map.setBearing((b + 0.1) % 360);
      }
      frame = requestAnimationFrame(rotate);
    };
    rotate();

    mapRef.current = map;
    return () => {
      cancelAnimationFrame(frame);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const src = mapRef.current?.getSource('points') as
      | mapboxgl.GeoJSONSource
      | undefined;
    if (!src) return;
    const features = points.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { color: p.color },
    }));
    src.setData({ type: 'FeatureCollection', features });
  }, [points]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (focus) {
      map.flyTo({ center: [focus.lng, focus.lat], zoom: 4, speed: 0.8 });
    } else if (selectedCountry) {
      const pts = contents.filter(c => c.country === selectedCountry);
      if (!pts.length) return;
      const bounds = pts.reduce(
        (b, c) => b.extend([c.coords.lng, c.coords.lat]),
        new mapboxgl.LngLatBounds(),
      );
      map.fitBounds(bounds, { padding: 40 });
    }
  }, [focus, selectedCountry, contents]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default HuMapboxGlobe;
