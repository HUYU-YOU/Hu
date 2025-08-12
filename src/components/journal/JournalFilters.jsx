import styles from './Journal.module.css';

export default function JournalFilters({ filters, setFilters }) {
  return (
    <div className={styles.filters}>
      <select
        value={filters.type}
        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        className={styles.filterSelect}
      >
        <option value="all">Tous les types</option>
        <option value="citation">Citations</option>
        <option value="defi">Défis</option>
        <option value="video">Vidéos</option>
      </select>

      <select
        value={filters.emotion}
        onChange={(e) => setFilters((f) => ({ ...f, emotion: e.target.value }))}
        className={styles.filterSelect}
      >
        <option value="all">Toutes les émotions</option>
        <option value="jaune">Joie</option>
        <option value="bleu">Tristesse</option>
        <option value="rouge">Colère</option>
        <option value="rose">Amour</option>
        <option value="noir">Peur</option>
        <option value="violet">Honte</option>
      </select>
    </div>
  );
}
