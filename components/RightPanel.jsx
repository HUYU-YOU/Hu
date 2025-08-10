import React, { useState } from 'react';
import { emotions, emotionKeys } from '../utils/constants';
import styles from './RightPanel.module.css';

export default function RightPanel({ data, selectedEmotions, setSelectedEmotions, onSelect }) {
  const pageSize = 8;
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
        {emotionKeys.map((key) => (
          <label key={key} style={{ backgroundColor: emotions[key].color }}>
            <input
              type="checkbox"
              checked={selectedEmotions.includes(key)}
              onChange={() => toggleEmotion(key)}
            />
            {emotions[key].label}
          </label>
        ))}
      </div>
      <ul className={styles.feed}>
        {pageItems.map(item => (
          <li
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              borderLeft: `4px solid ${emotions[item.emotion].color}`,
              paddingLeft: '8px',
              marginBottom: '8px',
              cursor: 'pointer',
            }}
          >
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
