import { useMemo } from 'react';
import * as THREE from 'three';

const shader = {
  vertex: /* glsl */`
    varying vec3 vWorldNormal;
    void main(){
      vWorldNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.03, 1.0);
    }
  `,
  fragment: /* glsl */`
    precision highp float;
    varying vec3 vWorldNormal;
    void main(){
      float fresnel = pow(1.0 - abs(vWorldNormal.z), 2.0);
      vec3 col = mix(vec3(0.08,0.18,0.45), vec3(0.5,0.7,1.0), fresnel);
      gl_FragColor = vec4(col * 0.25 * (0.5 + fresnel), 1.0);
    }
  `
};

export default function Atmosphere(){
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: shader.vertex,
    fragmentShader: shader.fragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);
  return (
    <mesh>
      <sphereGeometry args={[1.03,64,64]} />
      <primitive attach="material" object={mat} />
    </mesh>
  );
}
