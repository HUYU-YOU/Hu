import { useAppState, EmotionColor } from '@/context/AppContext';
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
  const { emotions, toggleEmotion, contents, selectedCountry, mode } = useAppState();
  const filtered = contents.filter(c =>
    emotions[c.emotion] && (selectedCountry ? c.country === selectedCountry : true) && c.type === mode
  );

  return (
    <aside className={styles.sidebar}>
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
          <li key={c.id} className={styles.item}>
            {c.title} ({c.country})
          </li>
        ))}
      </ul>
    </aside>
  );
};
