import { useEffect, useState } from 'react';
import styles from '@/components/profile/Profile.module.css';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileBadges from '@/components/profile/ProfileBadges';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileEditModal from '@/components/profile/ProfileEditModal';

export default function ProfilePage() {
  const [openEdit, setOpenEdit] = useState(false);
  const [human, setHuman] = useState(null);

  useEffect(() => {
    setHuman({
      id: 'h_01',
      displayName: 'Luna',
      handle: 'luna',
      bio: 'On construit des ponts, pas des murs.',
      avatarUrl: '/img/ava1.jpg',
      country: 'FR',
      flags: ['FR', 'pride'],
      convictions: ['écologie', 'droits humains'],
      topics: ['chats', 'hiphop', 'boxe'],
    });
  }, []);

  if (!human) return null;

  return (
    <main className={styles.shell} aria-label="Profil">
      <section className={styles.panel}>
        <ProfileHeader
          avatarUrl={human.avatarUrl}
          displayName={human.displayName}
          handle={human.handle}
          bio={human.bio}
          onEdit={() => setOpenEdit(true)}
        />

        <div className={styles.row}>
          <ProfileBadges flags={human.flags} convictions={human.convictions} country={human.country} />
        </div>

        <ProfileTabs humanId={human.id} />
      </section>

      {openEdit && (
        <ProfileEditModal
          initial={human}
          onClose={() => setOpenEdit(false)}
          onSave={next => {
            setHuman(next);
            setOpenEdit(false);
          }}
        />
      )}
    </main>
  );
}
