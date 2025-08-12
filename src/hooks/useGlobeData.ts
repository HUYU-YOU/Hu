import { useEffect, useState } from 'react';
import { useAppState } from '@/context/AppContext';

export function useGlobeData() {
  const { mode, emotions, selectedCountry } = useAppState();
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    const colors = Object.entries(emotions).filter(([, v]) => v).map(([k]) => k);
    const qs = new URLSearchParams();
    qs.set('types', mode);
    if (colors.length) qs.set('colors', colors.join(','));
    if (selectedCountry) qs.set('flags', selectedCountry);
    fetch(`/api/globe/points?${qs.toString()}`)
      .then(r => r.json())
      .then(setPoints);
  }, [mode, emotions, selectedCountry]);

  return points;
}
