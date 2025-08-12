import styles from './Journal.module.css';

const COLOR_MAP = {
  jaune: '#FFD400',
  bleu: '#2F80ED',
  rouge: '#EB5757',
  rose: '#F299C1',
  noir: '#111111',
  violet: '#9B51E0',
};

export default function JournalItem({ post }) {
  const bg = COLOR_MAP[post.emotion] || '#f4f4f4';

  return (
    <article className={styles.item} style={{ background: bg }}>
      {post.type === 'citation' && <p>{post.text}</p>}
      {post.type === 'defi' && <strong>{post.title}</strong>}
      {post.type === 'video' && <strong>🎥 {post.title}</strong>}
      <div className={styles.meta}>
        {new Date(post.created_at).toLocaleDateString()} • {post.emotion}
      </div>
    </article>
  );
}
