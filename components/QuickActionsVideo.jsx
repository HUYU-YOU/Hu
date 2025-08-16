import React, { useEffect } from 'react';
import { useHuStore } from '../stores/useHuStore';
import { COLOR_MAP } from '../hooks/useGlobeData';

export default function QuickActionsVideo() {
  const setQuickAction = useHuStore((s) => s.setQuickAction);
  const toggleColor = useHuStore((s) => s.toggleColor);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setQuickAction(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setQuickAction]);

  return (
    <div
      data-testid="qa-video"
      style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: 10, border: '1px solid #ccc', zIndex: 30 }}
    >
      <button data-testid="qa-video-close" onClick={() => setQuickAction(null)} style={{ float: 'right' }}>
        ×
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Object.entries(COLOR_MAP).map(([name, hex]) => (
          <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input data-testid={`qa-video-color-${name}`} type="checkbox" onChange={() => toggleColor(name)} />
            <span style={{ background: hex, width: 12, height: 12, borderRadius: '50%' }} />
            {name}
          </label>
        ))}
      </div>
    </div>
  );
}
