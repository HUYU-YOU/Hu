import * as THREE from 'three';

export function makeEarthMaterial(dayTexture, nightTexture, bumpTexture) {
  return new THREE.MeshPhongMaterial({
    map: dayTexture,
    emissiveMap: nightTexture,
    bumpMap: bumpTexture,
    bumpScale: 1,
  });
}
