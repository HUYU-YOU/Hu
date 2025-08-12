import styles from './Journal.module.css';

export default function JournalHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src="/img/ava1.jpg" alt="" className={styles.avatar} />
        <h2>Mon Journal</h2>
      </div>
      <button className={styles.createBtn}>+ Créer</button>
    </header>
  );
}
