import { useState } from 'react';
import { emotionList, emotionColors } from '../utils/constants.js';
import styles from '../styles/RightPanel.module.css';

export default function RightPanel({ data, selectedEmotions, setSelectedEmotions, onSelect }) {
  const pageSize = 5;
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(data.length / pageSize) || 1;
  const pageItems = data.slice(page * pageSize, (page + 1) * pageSize);

  function toggleEmotion(em) {
    if (selectedEmotions.includes(em)) {
      setSelectedEmotions(selectedEmotions.filter(x => x !== em));
    } else {
      setSelectedEmotions([...selectedEmotions, em]);
    }
    setPage(0);
  }

  return (
    <div className={styles.rightPanel}>
      <div className={styles.emotions}>
        {emotionList.map(em => (
          <label key={em} style={{ backgroundColor: emotionColors[em] }}>
            <input
              type="checkbox"
              checked={selectedEmotions.includes(em)}
              onChange={() => toggleEmotion(em)}
            />
            {em}
          </label>
        ))}
      </div>
      <ul className={styles.feed}>
        {pageItems.map(item => (
          <li key={item.id} onClick={() => onSelect(item)}>
            {item.title} - {item.country}
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>{page + 1}/{pageCount}</span>
        <button disabled={page + 1 >= pageCount} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
