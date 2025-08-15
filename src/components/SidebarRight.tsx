import { useAppState, EmotionColor } from '@/context/AppContext';
import { emotionHex } from '@/utils/constants';
import FlagPill from './FlagPill';
import styles from './Sidebar.module.css';

const emotionMap: Record<EmotionColor, { label: string; emoji: string }> = {
  jaune: { label: 'Joie', emoji: '😊' },
  bleu: { label: 'Curiosité', emoji: '🧠' },
  rouge: { label: 'Colère', emoji: '🔥' },
  vert: { label: 'Nature', emoji: '🌿' },
  orange: { label: 'Énergie', emoji: '⚡' },
  noir: { label: 'Détresse', emoji: '🆘' },
};

export const SidebarRight = () => {
  const { emotions, toggleEmotion, contents, selectedCountry, selectedFlag, mode, setFocus } = useAppState();
  const filtered = contents.filter(
    c =>
      emotions[c.emotion] &&
      (selectedCountry ? c.country === selectedCountry : true) &&
      (selectedFlag ? c.flags?.includes(selectedFlag) : true) &&
      c.type === mode,
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filters}>
        {Object.keys(emotions).map(key => (
          <label key={key} className={styles.filterLabel}>
            <input
              type="checkbox"
              checked={emotions[key as EmotionColor]}
              onChange={() => toggleEmotion(key as EmotionColor)}
            />
            <span className={styles.emoji}>{emotionMap[key as EmotionColor].emoji}</span>
            {emotionMap[key as EmotionColor].label}
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
