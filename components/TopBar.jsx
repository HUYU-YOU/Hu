import { useState } from 'react';
import styles from '../styles/TopBar.module.css';

export default function TopBar({
  view,
  setView,
  mapStyle,
  setMapStyle,
  theme,
  setTheme,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.topBar}>
      <button className={styles.logo}>hu.</button>
      <div className={styles.center}>
        <button
          className={view === 'video' ? styles.active : ''}
          onClick={() => setView('video')}
        >
          Vidéo
        </button>
        <button
          className={view === 'live' ? styles.active : ''}
          onClick={() => setView('live')}
        >
          Live <span className={styles.counter}>0</span>
        </button>
      </div>
      <div className={styles.right}>
        <button onClick={() => setMapStyle(mapStyle === 'light' ? 'satellite' : 'light')}>
          🌍
        </button>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className={styles.settingsWrapper}>
          <button onClick={() => setOpen(o => !o)}>⚙️</button>
          {open && (
            <div className={styles.settingsMenu}>
              <button>Déconnexion</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
