import * as THREE from 'three';

export const earthVertex = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const earthFragment = /* glsl */`
  precision highp float;
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uBumpMap;
  uniform float uDayFactor;
  uniform vec3 uLightDir;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    vec3 dayColor   = texture2D(uDayMap,   vUv).rgb;
    vec3 nightColor = texture2D(uNightMap, vUv).rgb;
    float bump = texture2D(uBumpMap, vUv).r;
    vec3 n = normalize(vNormal + (bump - 0.5) * 0.15);
    vec3 L = normalize(uLightDir);
    float NdotL = max(dot(n, L), 0.0);
    float dayMask = uDayFactor * smoothstep(0.0, 0.2, NdotL);
    float nightMask = 1.0 - dayMask;
    vec3 color = dayColor * (0.25 + 0.75 * NdotL) * dayMask
               + nightColor * (0.6 + 0.4 * (1.0 - NdotL)) * nightMask;
    float edge = smoothstep(0.0, 0.15, abs(vUv.y - 0.5));
    color *= 1.0 - edge * 0.06;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function makeEarthMaterial(day, night, bump) {
  day.wrapS = day.wrapT = THREE.RepeatWrapping;
  night.wrapS = night.wrapT = THREE.RepeatWrapping;
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  return new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    uniforms: {
      uDayMap:   { value: day },
      uNightMap: { value: night },
      uBumpMap:  { value: bump },
      uDayFactor:{ value: 1 },
      uLightDir: { value: new THREE.Vector3(1,1,1).normalize() },
    }
  });
}
