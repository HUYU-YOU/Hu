import { TopBar } from '@/components/TopBar';
import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { HuGlobe } from '@/components/HuGlobe';

export default function Home() {
  return (
    <div className="app">
      <div className="topbar">
        <TopBar />
      </div>
      <div className="left">
        <SidebarLeft />
      </div>
      <div className="center">
        <div className="globe">
          <HuGlobe />
        </div>
      </div>
      <div className="right">
        <SidebarRight />
      </div>
    </div>
  );
}
