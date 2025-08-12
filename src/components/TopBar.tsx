import Link from 'next/link';
import { useState } from 'react';
import { useAppState } from '@/context/AppContext';
import styles from './TopBar.module.css';

export const TopBar = () => {
  const { mode, setMode, contents, toggleTheme, toggleMapStyle, theme, mapStyle, logout } = useAppState();
  const [open, setOpen] = useState(false);
  const liveCount = contents.filter(c => c.type === 'live').length;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/menu">hu.</Link>
      </div>
      <div className={styles.center}>
        <button
          className={`${styles.modeBtn} ${mode === 'video' ? styles.active : ''}`}
          onClick={() => setMode('video')}
        >
          VIDÉO
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'live' ? styles.active : ''}`}
          onClick={() => setMode('live')}
        >
          LIVE ({liveCount})
        </button>
        <button className={styles.disabledBtn} disabled>
          🎯 Quizz
        </button>
        <button className={styles.disabledBtn} disabled>
          🏆 Défi
        </button>
      </div>
      <div className={styles.right}>
        <button className={styles.settingsBtn} onClick={() => setOpen(o => !o)}>⚙️</button>
        {open && (
          <div className={styles.menu}>
            <button onClick={toggleTheme}>Mode {theme === 'light' ? 'nuit' : 'jour'}</button>
            <button onClick={toggleMapStyle}>Carte {mapStyle === 'standard' ? 'satellite' : 'standard'}</button>
            <button onClick={logout}>Déconnexion</button>
          </div>
        )}
      </div>
    </header>
  );
};
