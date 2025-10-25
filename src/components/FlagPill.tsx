import Image from 'next/image';
import { getFlag } from '@/data/flags';
import styles from './Sidebar.module.css';

export const FlagPill = ({ id }: { id: string }) => {
  const flag = getFlag(id);
  if (!flag) return null;
  const label = flag.label.fr;
  return (
    <span className={styles.flagPill}>
      <Image src={flag.icon} alt={label} width={16} height={12} />
      <span className={styles.flagLabel}>{label}</span>
    </span>
  );
};

export default FlagPill;
