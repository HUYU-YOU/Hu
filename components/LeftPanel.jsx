import { sampleData } from '@/data/sampleData';
import styles from '@/styles/LeftPanel.module.css';

export default function LeftPanel({ selectedCountry, setSelectedCountry, bias, setBias }) {
  const countries = Array.from(new Set(sampleData.map(d => d.country)));

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
