import { TopBar } from '@/components/TopBar';
import { SidebarRight } from '@/components/SidebarRight';
import { HuGlobe } from '@/components/HuGlobe';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />
      <div id="layout">
        <main>
          <HuGlobe />
        </main>
        <SidebarRight />
      </div>
    </div>
  );
}
