import { useState } from 'react';
import HuMapboxGlobe from '../components/HuMapboxGlobe';
import TopBar from '../components/TopBar';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';
import { sampleData } from '../data/sampleData.js';

export default function Home() {
  const [view, setView] = useState('video');
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [bias, setBias] = useState(true);

  return (
    <div className="app">
      <TopBar view={view} setView={setView} />
      <LeftPanel
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        bias={bias}
        setBias={setBias}
      />
      <HuMapboxGlobe
        data={sampleData}
        view={view}
        emotions={selectedEmotions}
        country={selectedCountry}
      />
      <RightPanel
        data={sampleData}
        selectedEmotions={selectedEmotions}
        setSelectedEmotions={setSelectedEmotions}
        view={view}
      />
    </div>
  );
}
