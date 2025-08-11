import styles from './LeftPanel.module.css';

export default function LeftPanel({ bias, setBias }) {
  return (
    <div className={styles.leftPanel}>
      <button onClick={() => setBias(!bias)} className={styles.biasBtn}>
        Biais {bias ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
