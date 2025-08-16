import { useEffect, useState } from 'react';
import styles from '@/components/journal/Journal.module.css';
import JournalHeader from '@/components/journal/JournalHeader';
import JournalFilters from '@/components/journal/JournalFilters';
import JournalList from '@/components/journal/JournalList';

export default function JournalPage() {
  const [filters, setFilters] = useState({ type: 'all', emotion: 'all' });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts([
      {
        id: 'p1',
        type: 'citation',
        text: 'Le courage commence par la peur.',
        emotion: 'noir',
        created_at: '2025-08-12T08:00:00Z',
      },
      {
        id: 'p2',
        type: 'defi',
        title: 'Prends en photo un détail qui te fait sourire.',
        emotion: 'jaune',
        created_at: '2025-08-11T14:00:00Z',
      },
      {
        id: 'p3',
        type: 'video',
        title: 'Coucher de soleil sur Paris',
        emotion: 'rose',
        created_at: '2025-08-10T19:00:00Z',
      },
    ]);
  }, [filters]);

  return (
    <main className={styles.shell}>
      <div className={styles.panel}>
        <JournalHeader />
        <JournalFilters filters={filters} setFilters={setFilters} />
        <JournalList posts={posts} />
      </div>
    </main>
  );
}
