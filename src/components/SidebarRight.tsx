import { useMemo } from 'react';
import { useAppState, EmotionColor } from '@/context/AppContext';
import { emotionHex } from '@/utils/constants';
import { metaFlags } from '@/data/flags';
import FlagPill from './FlagPill';
import styles from './Sidebar.module.css';

const emotionLabels: Record<EmotionColor, string> = {
  jaune: 'Joie',
  bleu: 'Curiosité',
  rouge: 'Colère',
  vert: 'Nature',
  orange: 'Énergie',
  noir: 'Détresse',
};

export const SidebarRight = () => {
  const {
    emotions,
    toggleEmotion,
    contents,
    selectedCountry,
    setCountry,
    selectedFlag,
    setFlag,
    bias,
    toggleBias,
    mode,
    setFocus,
  } = useAppState();
  const countries = useMemo(() => Array.from(new Set(contents.map(c => c.country))).sort(), [contents]);
  const filtered = contents.filter(
    c =>
      emotions[c.emotion] &&
      (selectedCountry ? c.country === selectedCountry : true) &&
      (selectedFlag ? c.flags?.includes(selectedFlag) : true) &&
      c.type === mode,
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
      <div className={styles.filters}>
        {Object.keys(emotions).map(key => (
          <label key={key} className={styles.filterLabel}>
            <input type="checkbox" checked={emotions[key as EmotionColor]} onChange={() => toggleEmotion(key as EmotionColor)} />
            {emotionLabels[key as EmotionColor]}
          </label>
        ))}
      </div>
      <ul className={styles.list}>
        {filtered.map(c => (
          <li
            key={c.id}
            className={styles.item}
            style={{ borderLeftColor: emotionHex[c.emotion], cursor: 'pointer' }}
            onClick={() => setFocus(c.coords)}
          >
            <span className={styles.title}>{c.title}</span>
            {c.flags && (
              <span className={styles.meta}>
                {c.flags.map(f => (
                  <FlagPill key={f} id={f} />
                ))}
              </span>
            )}
            <span className={styles.meta}>
              {c.country} • {c.type}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};
