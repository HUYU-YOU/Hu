import styles from './Profile.module.css';

export default function ProfileHeader({ avatarUrl, displayName, handle, bio, onEdit }){
  return (
    <header className={styles.header}>
      <img src={avatarUrl} alt="" className={styles.avatar} />
      <div className={styles.title}>
        <div className={styles.name}>{displayName}</div>
        <div className={styles.handle}>@{handle}</div>
        {bio && <p className={styles.bio}>{bio}</p>}
      </div>
      <button className={styles.editBtn} onClick={onEdit} aria-label="Modifier le profil">Éditer</button>
    </header>
  );
}
