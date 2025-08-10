import Link from 'next/link';
import styles from './Menu.module.css';

export default function Menu() {
  return (
    <div className={styles.carousel}>
      <div className={styles.slide}>
        <Link href="/messages" className={styles.option}>
          Messagerie
        </Link>
      </div>
      <div className={styles.slide}>
        <Link href="/profile" className={styles.option}>
          Profil
        </Link>
      </div>
      <div className={styles.slide}>
        <Link href="/" className={styles.option}>
          Carte
        </Link>
      </div>
    </div>
  );
}
