import styles from './Profile.module.css';

const FLAG_ICONS = {
  FR: '/flags/FR.svg',
  pride: '/flags/pride.svg',
  trans: '/flags/trans.svg',
  climate: '/flags/climate.svg',
};

export default function ProfileBadges({ flags = [], convictions = [], country }) {
  return (
    <div className={styles.badges}>
      {flags.map((id) => (
        <span key={id} className={styles.pill} title={id}>
          {FLAG_ICONS[id] && <img src={FLAG_ICONS[id]} alt="" width={16} height={16} />}
          {id}
        </span>
      ))}
      {convictions.map((c) => (
        <span key={c} className={styles.pill}>{c}</span>
      ))}
      {country && !flags.includes(country) && (
        <span className={styles.pill}>
          {FLAG_ICONS[country] && <img src={FLAG_ICONS[country]} alt="" width={16} height={16} />}
          {country}
        </span>
      )}
    </div>
  );
}
