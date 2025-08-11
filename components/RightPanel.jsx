import React, { useEffect, useState } from 'react';
import { emotions, emotionKeys } from '../utils/constants.js';
import styles from './RightPanel.module.css';

export default function RightPanel({ data, selectedEmotions, setSelectedEmotions, onSelect }) {
  const PAGE = 20;
  const [feedItems, setFeedItems] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setFeedItems(data.slice(0, PAGE));
    setPage(1);
  }, [data]);

  function loadMore() {
    const next = data.slice(page * PAGE, (page + 1) * PAGE);
    if (next.length) {
      setFeedItems((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
    }
  }

  function toggleEmotion(em) {
    if (selectedEmotions.includes(em)) {
      setSelectedEmotions(selectedEmotions.filter((x) => x !== em));
    } else {
      setSelectedEmotions([...selectedEmotions, em]);
    }
  }

  return (
    <div className={styles.rightPanel}>
      <div className={styles.emotions}>
        {emotionKeys.map((key) => (
          <label
            key={key}
            className={`${styles.emotion} ${
              selectedEmotions.includes(key) ? styles.selected : ''
            }`}
            style={{ backgroundColor: emotions[key].color }}
          >
            <input
              type="checkbox"
              checked={selectedEmotions.includes(key)}
              onChange={() => toggleEmotion(key)}
            />
            <span className={styles.emoji}>{emotions[key].emoji}</span>
          </label>
        ))}
      </div>
      <ul
        className={styles.feed}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
            loadMore();
          }
        }}
      >
        {feedItems.map((item) => (
          <li
            key={item.id}
            className={styles.feedItem}
            style={{ borderLeftColor: emotions[item.emotion].color }}
            onClick={() => onSelect(item)}
          >
            {item.title} - {item.country}
          </li>
        ))}
      </ul>
    </div>
  );
}
