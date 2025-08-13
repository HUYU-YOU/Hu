import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useAppState } from '@/context/AppContext';
import styles from './TopBar.module.css';

export const TopBar = () => {
  const {
    mode,
    setMode,
    contents,
    toggleTheme,
    toggleMapStyle,
    theme,
    mapStyle,
    emotions,
    selectedCountry,
    selectedFlag,
  } = useAppState();
  const [open, setOpen] = useState(false);
  const [showDefis, setShowDefis] = useState(false);
  const [showQuizz, setShowQuizz] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const liveCount = contents.filter(c => c.type === 'live').length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDefis(false);
        setShowQuizz(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const visible = useMemo(
    () =>
      contents.filter(
        c =>
          emotions[c.emotion] &&
          (!selectedCountry || c.country === selectedCountry) &&
          (!selectedFlag || c.flags?.includes(selectedFlag)) &&
          c.type === mode,
      ).length,
    [contents, emotions, selectedCountry, selectedFlag, mode],
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/menu">
            <Image src="/logo.svg" alt="Hu Logo" width={150} height={50} />
          </Link>
        </div>
        <div className={styles.center}>
          <button
            className={`${styles.modeBtn} ${showDefis ? styles.active : ''}`}
            onClick={() => setShowDefis(v => !v)}
            aria-haspopup="dialog"
            aria-expanded={showDefis}
            aria-controls="hu-defis-drawer"
            title="Ouvrir les défis"
          >
            DÉFIS
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'video' ? styles.active : ''}`}
            onClick={() => setMode('video')}
            title="Afficher/masquer les vidéos"
          >
            VIDÉO
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'live' ? styles.active : ''}`}
            onClick={() => setMode('live')}
            title="Afficher/masquer les lives"
          >
            LIVE ({liveCount})
          </button>
          <button
            className={`${styles.modeBtn} ${showQuizz ? styles.active : ''}`}
            onClick={() => setShowQuizz(q => !q)}
            aria-haspopup="dialog"
            aria-expanded={showQuizz}
            aria-controls="hu-quiz-drawer"
            title="Ouvrir les quizz"
          >
            QUIZZ
          </button>
        </div>
        <div className={styles.right}>
          <div className={styles.kpi}>Visibles : {visible}</div>
          {session ? (
            <>
              <button className={styles.settingsBtn} onClick={() => setOpen(o => !o)}>⚙️</button>
              {open && (
                <div className={styles.menu}>
                  <button onClick={toggleTheme}>Mode {theme === 'light' ? 'nuit' : 'jour'}</button>
                  <button onClick={toggleMapStyle}>Carte {mapStyle === 'standard' ? 'satellite' : 'standard'}</button>
                  <hr className={styles.menuDivider} />
                  <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })}>Déconnexion</button>
                </div>
              )}
            </>
          ) : (
            <button className={styles.loginBtn} onClick={() => router.push('/login')}>Connexion</button>
          )}
        </div>
      </header>

      {showQuizz && (
        <>
          <div className="hu-quiz-backdrop" onClick={() => setShowQuizz(false)} aria-hidden="true" />
          <aside
            id="hu-quiz-drawer"
            role="dialog"
            aria-modal="true"
            className="hu-quiz-drawer"
          >
            <div className="hu-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Quizz</span>
              <button onClick={() => setShowQuizz(false)} aria-label="Fermer">
                ✕
              </button>
            </div>
            <div className="hu-quiz-body">
              <div className="hu-quiz-card">
                <h4>Quizz du jour</h4>
                <p>Teste tes connaissances Hu. ~2 min.</p>
                <button className="hu-quiz-cta">Jouer maintenant</button>
              </div>
              <div className="hu-quiz-card">
                <h4>Par couleur</h4>
                <div className="hu-quiz-row">
                  {['jaune', 'bleu', 'rouge', 'vert', 'orange', 'violet', 'noir'].map(c => (
                    <button key={c} className="hu-quiz-chip">
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {showDefis && (
        <>
          <div className="hu-defis-backdrop" onClick={() => setShowDefis(false)} aria-hidden="true" />
          <aside
            id="hu-defis-drawer"
            role="dialog"
            aria-modal="true"
            className="hu-defis-drawer"
          >
            <div className="hu-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Défis</span>
              <button onClick={() => setShowDefis(false)} aria-label="Fermer">
                ✕
              </button>
            </div>

            <div className="hu-defis-body">
              <section className="hu-defi-card">
                <div className="hu-defi-meta">
                  <span className="hu-pill">Aujourd'hui</span>
                  <span className="hu-time">🕒 reste 12h</span>
                </div>
                <h4>
                  Un détail <b>jaune</b> de ta journée
                </h4>
                <p>Photo/vidéo courte (≤ 20s) + une phrase.</p>
                <div className="hu-actions">
                  <button className="hu-cta">Participer</button>
                  <button className="hu-link">Voir dans le Journal ↗</button>
                </div>
              </section>

              <section className="hu-defi-card">
                <div className="hu-defi-meta">
                  <span className="hu-pill violet">Cette semaine</span>
                  <span className="hu-time">7 jours</span>
                </div>
                <h4>“Une main tendue”</h4>
                <p>Montre un geste de bienveillance. 1 post/jour max.</p>
                <div className="hu-actions">
                  <button className="hu-cta">Rejoindre</button>
                  <button className="hu-link">Participations ↗</button>
                </div>
              </section>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default TopBar;
