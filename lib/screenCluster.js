import * as THREE from 'three';

export function clusterScreen(points, camera, rendererSize, cellPx = 32){
  if(!points.length) return [];
  const w = rendererSize.width, h = rendererSize.height;
  const grid = new Map();
  const v = new THREE.Vector3();
  for(const p of points){
    v.copy(p.position).project(camera);
    const sx = Math.round(((v.x + 1) * 0.5 * w) / cellPx);
    const sy = Math.round(((1 - (v.y + 1) * 0.5) * h) / cellPx);
    const key = sx + ':' + sy;
    const cell = grid.get(key) || { sx, sy, items: [] };
    cell.items.push(p);
    grid.set(key, cell);
  }
  const out = [];
  grid.forEach((cell) => {
    const cx = cell.sx * cellPx + cellPx * 0.5;
    const cy = cell.sy * cellPx + cellPx * 0.5;
    const ndc = new THREE.Vector3((cx / w) * 2 - 1, -((cy / h) * 2 - 1), 0.5);
    const world = ndc.unproject(camera);
    out.push({ cx, cy, world, data: cell.items });
  });
  return out;
}
