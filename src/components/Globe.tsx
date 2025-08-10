import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import { useAppState } from '@/context/AppContext';
import { emotionHex } from '@/utils/constants';

// react-globe.gl must be loaded client-side
const GlobeGL = dynamic(() => import('react-globe.gl'), { ssr: false });

export const Globe = () => {
  const { contents, emotions, selectedCountry, mode, focus } = useAppState();
  const globeRef = useRef<any>(null);

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

  // center on focused coordinates
  useEffect(() => {
    if (!focus || !globeRef.current) return;
    globeRef.current.pointOfView({ lat: focus.lat, lng: focus.lng, altitude: 1.5 }, 1000);
  }, [focus]);

  // center on selected country
  useEffect(() => {
    if (!selectedCountry || !globeRef.current) return;
    const pts = contents.filter(c => c.country === selectedCountry);
    if (!pts.length) return;
    const lat = pts.reduce((s, p) => s + p.coords.lat, 0) / pts.length;
    const lng = pts.reduce((s, p) => s + p.coords.lng, 0) / pts.length;
    globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000);
  }, [selectedCountry, contents]);

  return (
    <GlobeGL
      ref={globeRef}
      style={{ width: '100%', height: '100%' }}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      backgroundColor="#000"
      pointsData={points}
      pointLat="lat"
      pointLng="lng"
      pointColor="color"
      pointRadius={0.5}
      autoRotate
      autoRotateSpeed={0.5}
    />
  );
};
