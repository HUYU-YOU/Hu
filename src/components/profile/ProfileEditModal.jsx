import { useEffect, useRef, useState } from 'react';
import styles from './Profile.module.css';

const FLAG_OPTIONS = [
  { id: 'FR', label: 'France' },
  { id: 'pride', label: 'Pride' },
  { id: 'trans', label: 'Trans' },
  { id: 'climate', label: 'Climat' },
];

const CONVICTIONS = ['écologie', 'droits humains', 'justice sociale', 'bienveillance'];

export default function ProfileEditModal({ initial, onClose, onSave }) {
  const [displayName, setDisplayName] = useState(initial.displayName || '');
  const [bio, setBio] = useState(initial.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl || '');
  const [flags, setFlags] = useState(initial.flags || []);
  const [convictions, setConvictions] = useState(initial.convictions || []);
  const ref = useRef(null);

  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onClose?.(); }
    function onClickOut(e) { if (ref.current && !ref.current.contains(e.target)) onClose?.(); }
    document.addEventListener('keydown', onEsc);
    document.addEventListener('mousedown', onClickOut);
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('mousedown', onClickOut);
    };
  }, [onClose]);

  function toggleFlag(id) {
    setFlags(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  }
  function toggleConv(c) {
    setConvictions(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));
  }

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Modifier le profil">
      <div className={styles.modal} ref={ref}>
        <h3>Modifier le profil</h3>
        <div className={styles.modalGrid}>
          <label>
            Nom affiché
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} />
          </label>
          <label>
            Bio
            <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} />
          </label>
          <label>
            Avatar (URL)
            <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." />
          </label>

          <div>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Drapeaux (max 2)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FLAG_OPTIONS.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggleFlag(f.id)}
                  aria-pressed={flags.includes(f.id)}
                  className={styles.pill}
                  style={{
                    background: flags.includes(f.id) ? '#111' : '#fff',
                    color: flags.includes(f.id) ? '#fff' : '#111',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Convictions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CONVICTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => toggleConv(c)}
                  aria-pressed={convictions.includes(c)}
                  className={styles.pill}
                  style={{
                    background: convictions.includes(c) ? '#111' : '#fff',
                    color: convictions.includes(c) ? '#fff' : '#111',
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,.1)',
              background: '#fff',
            }}
          >
            Annuler
          </button>
          <button
            onClick={() =>
              onSave?.({ ...initial, displayName, bio, avatarUrl, flags, convictions })
            }
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,.1)',
              background: '#111',
              color: '#fff',
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
