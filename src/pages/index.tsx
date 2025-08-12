import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { HuGlobe } from '@/components/HuGlobe';

export default function Home() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SidebarLeft />
      <main style={{ flex: 1 }}>
        <HuGlobe />
      </main>
      <SidebarRight />
    </div>
  );
}
