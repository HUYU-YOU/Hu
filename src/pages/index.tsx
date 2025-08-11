import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { HuGlobe } from '@/components/HuGlobe';

export default function Home() {
  const { user } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div id="layout">
        <SidebarLeft />
        <main>
          <HuGlobe />
        </main>
        <SidebarRight />
      </div>
    </div>
  );
}
