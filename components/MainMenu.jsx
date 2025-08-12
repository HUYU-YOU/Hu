import React, { useState } from 'react';

export default function MainMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <button onClick={() => setOpen(true)} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>hu.</button>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', zIndex: 20, display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setOpen(false)} style={{ alignSelf: 'flex-end', margin: 20, fontSize: 24 }}>×</button>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <div style={{ padding: 20, background: 'white', borderRadius: 8 }}>Globe</div>
            <div style={{ padding: 20, background: 'white', borderRadius: 8 }}>Messages</div>
            <div style={{ padding: 20, background: 'white', borderRadius: 8 }}>Profil</div>
          </div>
        </div>
      )}
    </>
  );
}
