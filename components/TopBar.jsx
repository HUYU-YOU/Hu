import styles from '../styles/TopBar.module.css';

export default function TopBar({ view, setView }) {
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
        <button>⚙️</button>
      </div>
    </div>
  );
}
