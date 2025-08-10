import { useAppState } from '@/context/AppContext';
import styles from './Sidebar.module.css';

const countries = ['France', 'Espagne', 'Brésil'];

export const SidebarLeft = () => {
  const { selectedCountry, setCountry, bias, toggleBias } = useAppState();

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
