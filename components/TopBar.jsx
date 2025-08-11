import { useState } from 'react';
import styles from './TopBar.module.css';

export default function TopBar({
  view,
  setView,
  mapStyle,
  setMapStyle,
  theme,
  setTheme,
  countries = [],
  selectedCountry,
  setSelectedCountry,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        <button className={styles.logo}>hu.</button>
        <select
          className={styles.countrySelect}
          value={selectedCountry || ''}
          onChange={(e) => setSelectedCountry(e.target.value || null)}
        >
          <option value="">Tous les pays</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
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
        <div className={styles.settingsWrapper}>
          <button onClick={() => setOpen((o) => !o)}>⚙️</button>
          {open && (
            <div className={styles.settingsMenu}>
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </button>
              <button onClick={() => setMapStyle(mapStyle === 'light' ? 'satellite' : 'light')}>
                {mapStyle === 'light' ? 'Satellite view' : 'Map view'}
              </button>
              <button>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
