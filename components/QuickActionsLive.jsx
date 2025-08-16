import React, { useEffect } from 'react';
import { useHuStore } from '../stores/useHuStore';

export default function QuickActionsLive() {
  const setQuickAction = useHuStore((s) => s.setQuickAction);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setQuickAction(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setQuickAction]);

  return (
    <div
      data-testid="qa-live"
      style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: 10, border: '1px solid #ccc', zIndex: 30 }}
    >
      <button data-testid="qa-live-close" onClick={() => setQuickAction(null)} style={{ float: 'right' }}>
        ×
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label>
          Qualité
          <select data-testid="qa-live-quality">
            <option value="auto">Auto</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </label>
        <label>
          Sous-titres
          <input data-testid="qa-live-captions" type="checkbox" defaultChecked />
        </label>
      </div>
    </div>
  );
}
