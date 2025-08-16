import styles from './Journal.module.css';
import JournalItem from './JournalItem';

export default function JournalList({ posts = [] }) {
  if (!posts.length) return <div>Aucun contenu dans ton journal pour le moment.</div>;
  return (
    <div className={styles.list}>
      {posts.map(p => (
        <JournalItem key={p.id} post={p} />
      ))}
    </div>
  );
}
