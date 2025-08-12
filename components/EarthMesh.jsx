import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { makeEarthMaterial } from '../shaders/earthShader';

export default function EarthMesh(){
  const mesh = useRef();
  const createTexture = (color) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 2;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 2, 2);
    return new THREE.CanvasTexture(canvas);
  };

  const day = useMemo(() => createTexture('#6ca1ff'), []);
  const night = useMemo(() => createTexture('#01112f'), []);
  const bump = useMemo(() => createTexture('#808080'), []);
  const mat = useMemo(() => makeEarthMaterial(day, night, bump), [day, night, bump]);

  useFrame(() => {
    const now = new Date();
    const t = now.getHours() + now.getMinutes()/60.0;
    const k = Math.cos(((t - 12.0) * Math.PI) / 12.0);
    mat.uniforms.uDayFactor.value = Math.max(0.0, 1.0 - (k + 1.0) / 2.0);
    mat.uniforms.uLightDir.value = new THREE.Vector3(2,1,1).normalize();
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1,128,128]} />
      <primitive attach="material" object={mat} />
    </mesh>
  );
}
