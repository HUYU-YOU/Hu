import { useMemo } from 'react';
import { useAppState } from '@/context/AppContext';
import styles from './Sidebar.module.css';

export const SidebarLeft = () => {
  const { contents, selectedCountry, setCountry, bias, toggleBias } = useAppState();
  const countries = useMemo(
    () => Array.from(new Set(contents.map(c => c.country))).sort(),
    [contents],
  );

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
      <label className={styles.bias}>
        <input type="checkbox" checked={bias} onChange={toggleBias} /> Biais {bias ? 'ON' : 'OFF'}
      </label>
    </aside>
  );
};
