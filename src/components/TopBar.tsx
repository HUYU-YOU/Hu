import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useAppState } from '@/context/AppContext';
import styles from './TopBar.module.css';

export const TopBar = () => {
  const { mode, setMode, contents, toggleTheme, toggleMapStyle, theme, mapStyle } = useAppState();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
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
        {session ? (
          <>
            <button className={styles.settingsBtn} onClick={() => setOpen(o => !o)}>⚙️</button>
            {open && (
              <div className={styles.menu}>
                <button onClick={toggleTheme}>Mode {theme === 'light' ? 'nuit' : 'jour'}</button>
                <button onClick={toggleMapStyle}>Carte {mapStyle === 'standard' ? 'satellite' : 'standard'}</button>
                <hr className={styles.menuDivider} />
                <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })}>Déconnexion</button>
              </div>
            )}
          </>
        ) : (
          <button className={styles.loginBtn} onClick={() => router.push('/login')}>Connexion</button>
        )}
      </div>
    </header>
  );
};
