import { useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useAppState } from '@/context/AppContext';
import { emotionHex } from '@/utils/constants';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const COUNTRY_BOUNDS: Record<string, [number, number, number, number]> = {
  France: [-5.5, 41.0, 9.9, 51.5],
  Espagne: [-9.5, 36.0, 3.3, 43.9],
  Brésil: [-74.0, -34.0, -34.7, 5.4],
  'États-Unis': [-125.0, 24.5, -66.5, 49.5],
  Japon: [123.0, 24.0, 146.2, 45.6],
  Australie: [112.0, -44.0, 154.0, -10.0],
  Inde: [68.0, 6.5, 97.5, 35.6],
  Nigéria: [2.7, 4.0, 14.7, 13.9],
  Canada: [-141.0, 41.7, -52.6, 83.1],
  Argentine: [-73.6, -55.1, -53.6, -21.8],
  Égypte: [24.7, 22.0, 36.9, 31.7],
  'Afrique du Sud': [16.0, -35.0, 33.0, -22.1],
};

export const HuGlobe = () => {
  const { contents, emotions, selectedCountry, selectedFlag, mode, focus, setFocus, theme } = useAppState();
  const globeRef = useRef<any>(null);

  const points = useMemo(
    () =>
      contents.filter(
        c =>
          emotions[c.emotion] &&
          (!selectedCountry || c.country === selectedCountry) &&
          (!selectedFlag || c.flags?.includes(selectedFlag)) &&
          c.type === mode,
      ),
    [contents, emotions, selectedCountry, selectedFlag, mode],
  );

  useEffect(() => {
    if (focus && globeRef.current) {
      globeRef.current.pointOfView({ lat: focus.lat, lng: focus.lng, altitude: 1.5 }, 800);
    }
  }, [focus]);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls;
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.1;
    }
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    const globe = globeRef.current;
    globe.scene?.add(ambient);
    // slightly enlarge the globe for a closer view if supported
    if (typeof globe.globeRadius === 'function') {
      const currentRadius = globe.globeRadius();
      globe.globeRadius(currentRadius * 1.05);
    }
    return () => {
      globe.scene?.remove(ambient);
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current || !selectedCountry) return;
    const b = COUNTRY_BOUNDS[selectedCountry];
    if (!b) return;
    const [minLng, minLat, maxLng, maxLat] = b;
    const lat = (minLat + maxLat) / 2;
    const lng = (minLng + maxLng) / 2;
    const span = Math.max(Math.abs(maxLat - minLat), Math.abs(maxLng - minLng));
    const altitude = Math.min(2.5, Math.max(0.5, span / 15));
    const globe = globeRef.current;
    if (globe && typeof globe.pointOfView === 'function') {
      globe.pointOfView({ lat, lng, altitude }, 1000);
    }
  }, [selectedCountry]);

  // Fallback material so the globe isn't rendered as a black sphere when
  // textures fail to load (e.g. in offline environments).
  const globeMaterial = new THREE.MeshPhongMaterial({ color: '#3a7ccd' });
  const background = theme === 'dark' ? '#000000' : '#e6f5d0';
  const globeImageUrl = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
  const bumpImageUrl = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
  const backgroundImageUrl = 'https://unpkg.com/three-globe/example/img/night-sky.png';

  return (
    <Globe
      ref={globeRef}
      width={undefined}
      height={undefined}
      backgroundColor={background}
      globeMaterial={globeMaterial}
      globeImageUrl={globeImageUrl}
      bumpImageUrl={bumpImageUrl}
      backgroundImageUrl={backgroundImageUrl}
      pointsData={points}
      pointLat={d => d.coords.lat}
      pointLng={d => d.coords.lng}
      pointColor={d => emotionHex[d.emotion]}
      pointAltitude={() => 0.02}
      onPointClick={d => setFocus(d.coords)}
    />
  );
};

export default HuGlobe;
