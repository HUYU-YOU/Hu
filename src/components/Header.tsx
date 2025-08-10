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
      <button onClick={() => setMode(mode === 'video' ? 'live' : 'video')} className={styles.modeBtn}>
        {mode === 'video' ? 'VIDÉO' : `LIVE (${liveCount})`}
      </button>
    </header>
  );
};
