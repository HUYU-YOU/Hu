import { useEffect, useState } from 'react';
import styles from './Profile.module.css';

export default function ProfileTabs({ humanId }) {
  const [tab, setTab] = useState('citations');
  const [citations, setCitations] = useState([]);
  const [defis, setDefis] = useState([]);

  useEffect(() => {
    setCitations([
      { id: 'c1', text: 'La joie est un pouvoir.', meta: 'jaune' },
      { id: 'c2', text: 'Le courage commence par la peur.', meta: 'noir' },
    ]);
    setDefis([
      { id: 'd1', title: 'Prends en photo un détail qui te fait sourire.' },
      { id: 'd2', title: 'Écris une phrase qui donne envie de se lever.' },
    ]);
  }, [humanId]);

  return (
    <section>
      <div className={styles.tabs} role="tablist" aria-label="Contenus du profil">
        <button
          className={`${styles.tabBtn} ${tab === 'citations' ? styles.active : ''}`}
          role="tab"
          aria-selected={tab === 'citations'}
          onClick={() => setTab('citations')}
        >
          Citations
        </button>
        <button
          className={`${styles.tabBtn} ${tab === 'defis' ? styles.active : ''}`}
          role="tab"
          aria-selected={tab === 'defis'}
          onClick={() => setTab('defis')}
        >
          Défis
        </button>
      </div>

      {tab === 'citations' && (
        <div className={styles.gridCards} role="region" aria-label="Mes citations">
          {citations.map(c => (
            <article key={c.id} className={styles.card}>
              <div style={{ fontSize: 14 }}>{c.text}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Émotion: {c.meta}</div>
            </article>
          ))}
        </div>
      )}

      {tab === 'defis' && (
        <div className={styles.gridCards} role="region" aria-label="Mes défis">
          {defis.map(d => (
            <article key={d.id} className={styles.card}>
              <strong>{d.title}</strong>
              <button
                style={{
                  justifySelf: 'start',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,.1)',
                  background: '#111',
                  color: '#fff',
                }}
              >
                Publier
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
