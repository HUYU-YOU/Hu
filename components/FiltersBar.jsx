import React, { useEffect } from 'react';
import { useHuStore } from '../stores/useHuStore';
import { useGlobeData, COLOR_MAP } from '../hooks/useGlobeData';

export default function FiltersBar() {
  const toggleType = useHuStore((s) => s.toggleType);
  const onlyType = useHuStore((s) => s.onlyType);
  const toggleColor = useHuStore((s) => s.toggleColor);
  const setCountry = useHuStore((s) => s.setCountry);
  const typeFilters = useHuStore((s) => s.filters.types);
  const colorFilters = useHuStore((s) => s.filters.colors);
  const country = useHuStore((s) => s.filters.country);
  const setQuickAction = useHuStore((s) => s.setQuickAction);
  const points = useGlobeData();

  const types = [
    { key: 'defis', label: 'Défis', testid: 'filter-defis' },
    { key: 'video', label: 'Vidéos', testid: 'filter-video' },
    { key: 'live', label: 'Lives', testid: 'filter-live' },
    { key: 'quiz', label: 'Quiz', testid: 'filter-quiz' },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'v') toggleType('video');
      if (key === 'l') toggleType('live');
      if (key === 'd') toggleType('defis');
      if (key === 'q') toggleType('quiz');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleType]);

  const countries = Array.from(new Set(points.map((c) => c.country))).sort();

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        background: 'rgba(255,255,255,0.6)',
        padding: '6px 10px',
        borderRadius: 8,
        alignItems: 'center',
      }}
    >
      {types.map((t) => {
        let timer;
        const holdProps =
          t.key === 'video' || t.key === 'live'
            ? {
                onMouseDown: () => {
                  timer = setTimeout(() => setQuickAction(t.key), 1000);
                },
                onMouseUp: () => clearTimeout(timer),
                onMouseLeave: () => clearTimeout(timer),
                onTouchStart: () => {
                  timer = setTimeout(() => setQuickAction(t.key), 1000);
                },
                onTouchEnd: () => clearTimeout(timer),
              }
            : {};
        return (
          <button
            key={t.key}
            data-testid={t.testid}
            onClick={() => toggleType(t.key)}
            onDoubleClick={() => onlyType(t.key)}
            style={{ fontWeight: typeFilters[t.key] ? 'bold' : 'normal' }}
            {...holdProps}
          >
            {t.label}
          </button>
        );
      })}
      {Object.entries(COLOR_MAP).map(([name, hex]) => (
        <button
          key={name}
          onClick={() => toggleColor(name)}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: colorFilters.has(name) ? '2px solid #000' : '1px solid #999',
            background: hex,
          }}
        />
      ))}
      <select
        value={country || ''}
        onChange={(e) => setCountry(e.target.value || null)}
        style={{ marginLeft: 4 }}
      >
        <option value="">Tous pays</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
