import { useMemo } from 'react';
import * as THREE from 'three';

export default function SOSHalo({ position, size = 0.05 }){
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64,64,0,64,64,64);
    grd.addColorStop(0, 'rgba(255,0,0,0.6)');
    grd.addColorStop(1, 'rgba(255,0,0,0.0)');
    g.fillStyle = grd; g.fillRect(0,0,128,128);
    const t = new THREE.Texture(c);
    t.needsUpdate = true;
    t.transparent = true;
    return t;
  }, []);
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial map={tex} depthWrite={false} depthTest transparent opacity={0.9} />
    </sprite>
  );
}
