import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { clusterScreen } from '../lib/screenCluster';
import { useHuStore } from '../stores/useHuStore';
import { useGlobeData, COLOR_MAP } from '../hooks/useGlobeData';
import { latLngToXYZ } from '../lib/geo';
import { useUser } from '../hooks/useUser';
import SOSHalo from './SOSHalo';

export default function PointsLayer(){
  const inst = useRef();
  const { size, camera } = useThree();
  const { filters } = useHuStore();
  const points = useGlobeData();
  const { user } = useUser();

  const renderables = useMemo(() => points.map(p => ({
    ...p,
    position: new THREE.Vector3(...Object.values(latLngToXYZ(p.lat, p.lng, 1.005)))
  })), [points]);

  const density = user?.map?.density || 1;
  const cellPx = useMemo(() => {
    const dist = camera.position.length();
    const base = THREE.MathUtils.clamp(32 * (dist / 2.0), 24, 56);
    return Math.round(base / density);
  }, [camera.position, density]);

  const clusters = useMemo(
    () => clusterScreen(renderables, camera, { width: size.width, height: size.height }, cellPx),
    [renderables, camera, size, cellPx]
  );

  useEffect(() => {
    if (!inst.current) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    clusters.forEach((cl, i) => {
      m.setPosition(cl.world);
      inst.current.setMatrixAt(i, m);
      const main = dominantColor(cl.data.map(d => d.color));
      c.set(COLOR_MAP[main] || '#FFC107');
      inst.current.setColorAt(i, c);
    });
    inst.current.count = clusters.length;
    inst.current.instanceMatrix.needsUpdate = true;
    if (inst.current.instanceColor) inst.current.instanceColor.needsUpdate = true;
  }, [clusters]);

  const showSOS = (user?.map?.prioritizeSOS) || filters.colors.has('noir');

  return (
    <>
      <instancedMesh
        ref={inst}
        args={[undefined, undefined, clusters.length]}
        onClick={(e) => {
          const cl = clusters[e.instanceId];
          if (cl && cl.data[0]) {
            document.dispatchEvent(new CustomEvent('hu:video:open', { detail: { id: cl.data[0].id } }));
          }
        }}
      >
        <sphereGeometry args={[0.009, 8, 8]} />
        <meshStandardMaterial metalness={0.1} roughness={0.6} />
      </instancedMesh>
      {showSOS && clusters.map((cl, i) => {
        const main = dominantColor(cl.data.map(d => d.color));
        return main === 'noir' ? <SOSHalo key={i} position={cl.world} /> : null;
      })}
    </>
  );
}

function dominantColor(colors) {
  const pri = ['noir', 'rouge', 'orange', 'jaune', 'bleu', 'vert'];
  const count = new Map();
  colors.forEach((c) => count.set(c, (count.get(c) || 0) + 1));
  return pri.sort((a, b) => (count.get(b) || 0) - (count.get(a) || 0))[0] || 'jaune';
}
