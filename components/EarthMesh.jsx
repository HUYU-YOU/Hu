import React, { useMemo } from 'react';
import * as THREE from 'three';
import { makeEarthMaterial } from '../shaders/earthShader';

function createSolidTexture(color) {
  const size = 4;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d');
  context.fillStyle = color;
  context.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function createBumpTexture() {
  const size = 4;
  const data = new Uint8Array(size * size);
  for (let i = 0; i < data.length; i++) {
    data[i] = 128; // flat grey bump
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.LuminanceFormat);
  texture.needsUpdate = true;
  return texture;
}

export default function EarthMesh(props) {
  const textures = useMemo(() => ({
    day: createSolidTexture('#2266ff'),
    night: createSolidTexture('#000011'),
    bump: createBumpTexture(),
  }), []);

  const material = useMemo(() =>
    makeEarthMaterial(textures.day, textures.night, textures.bump),
  [textures]);

  return (
    <mesh {...props} material={material}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}
