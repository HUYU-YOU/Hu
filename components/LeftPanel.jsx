import styles from '../styles/LeftPanel.module.css';

export default function LeftPanel({
  countries,
  selectedCountry,
  setSelectedCountry,
  bias,
  setBias,
}) {

  return (
    <div className={styles.leftPanel}>
      <select
        value={selectedCountry || ''}
        onChange={e => setSelectedCountry(e.target.value || null)}
      >
        <option value="">Tous les pays</option>
        {countries.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button onClick={() => setBias(!bias)} className={styles.biasBtn}>
        Biais {bias ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
