import { useMemo } from 'react';
import { useAppState } from '@/context/AppContext';
import { metaFlags } from '@/data/flags';
import styles from './Sidebar.module.css';

export const SidebarLeft = () => {
  const { contents, selectedCountry, setCountry, selectedFlag, setFlag, bias, toggleBias } = useAppState();
  const countries = useMemo(() => Array.from(new Set(contents.map(c => c.country))).sort(), [contents]);

  return (
    <aside className={styles.sidebar}>
      <label>
        Pays
        <select value={selectedCountry ?? ''} onChange={e => setCountry(e.target.value || null)}>
          <option value="">Monde entier</option>
          {countries.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        Drapeau
        <select value={selectedFlag ?? ''} onChange={e => setFlag(e.target.value || null)}>
          <option value="">Tous</option>
          {metaFlags.map(f => (
            <option key={f.id} value={f.id}>
              {f.label.fr}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.bias}>
        <input type="checkbox" checked={bias} onChange={toggleBias} /> Biais {bias ? 'ON' : 'OFF'}
      </label>
    </aside>
  );
};

export default SidebarLeft;
