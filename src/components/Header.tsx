import Link from 'next/link';
import { useAppState } from '@/context/AppContext';
import styles from './Header.module.css';

export const Header = () => {
  const { mode, setMode, contents } = useAppState();
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
      </div>
    </header>
  );
};
