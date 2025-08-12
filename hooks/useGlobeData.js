import { useEffect, useState } from 'react';
import { useHuStore } from '../stores/useHuStore';

export const COLOR_MAP = {
  jaune: '#FFD400',
  bleu: '#2F80ED',
  rouge: '#EB5757',
  vert: '#27AE60',
  orange: '#F2994A',
  noir: '#111111',
};

export function useGlobeData() {
  const filters = useHuStore((s) => s.filters);
  const [points, setPoints] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const h = () => setReloadKey((k) => k + 1);
    document.addEventListener('hu:globe:refresh', h);
    return () => document.removeEventListener('hu:globe:refresh', h);
  }, []);

  useEffect(() => {
    const qs = new URLSearchParams();
    const types = Object.entries(filters.types).filter(([, v]) => v).map(([k]) => k);
    if (types.length) qs.set('types', types.join(','));
    if (filters.colors.size) qs.set('colors', Array.from(filters.colors).join(','));
    if (filters.flags.size) qs.set('flags', Array.from(filters.flags).join(','));
    if (filters.country) qs.set('country', filters.country);
    qs.set('sort', filters.sort);

    let alive = true;
    fetch(`/api/globe/points?${qs.toString()}`)
      .then((r) => r.json())
      .then((j) => {
        if (alive) setPoints(j);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [filters, reloadKey]);

  return points;
}
