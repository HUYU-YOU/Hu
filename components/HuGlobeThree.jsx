import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import EarthMesh from './EarthMesh';
import Atmosphere from './Atmosphere';
import PointsLayer from './PointsLayer';

function SceneLights(){
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight intensity={0.8} position={[2,1,1]} />
    </>
  );
}

export default function HuGlobeThree(){
  const [rotation, setRotation] = useState(0.01);
  const controlsRef = useRef();

  useEffect(()=>{
    const handler = (e)=>setRotation(e.detail.speed);
    document.addEventListener('hu:globe:setRotation', handler);
    return ()=>document.removeEventListener('hu:globe:setRotation', handler);
  },[]);

  return (
    <div className="fixed inset-0" data-testid="globe-canvas">
      <Canvas camera={{ position:[0,0,2.2], fov:45 }}>
        <SceneLights />
        <EarthMesh />
        <Atmosphere />
        <PointsLayer />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.08} autoRotate autoRotateSpeed={rotation} />
      </Canvas>
    </div>
  );
}
