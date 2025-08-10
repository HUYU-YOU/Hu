import { useMemo, useState } from 'react';
import TopBar from './TopBar.jsx';
import LeftPanel from './LeftPanel.jsx';
import RightPanel from './RightPanel.jsx';
import { emotions, emotionKeys } from '../utils/constants.js';
import { sampleData } from '../data/sampleData.js';
import { useMapboxGlobe } from '../hooks/useMapboxGlobe.js';

export default function HuMapboxGlobe() {
  const [view, setView] = useState('video');
  const [selectedEmotions, setSelectedEmotions] = useState(emotionKeys);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [bias, setBias] = useState(true);
  const [mapStyle, setMapStyle] = useState('light');
  const [theme, setTheme] = useState('light');

  const countries = useMemo(
    () => Array.from(new Set(sampleData.map((d) => d.country))).sort(),
    []
  );

  const filteredData = useMemo(() => {
    return sampleData.filter(
      (d) =>
        d.type === view &&
        selectedEmotions.includes(d.emotion) &&
        (!selectedCountry || d.country === selectedCountry)
    );
  }, [view, selectedEmotions, selectedCountry]);

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: filteredData.map((d) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: d.coordinates },
        properties: {
          id: d.id,
          title: d.title,
          colorHex: emotions[d.emotion].color,
        },
      })),
    }),
    [filteredData]
  );
  const { mapContainerRef, flyTo } = useMapboxGlobe({ mapStyle, geojson });

  function handleSelect(item) {
    flyTo(item.coordinates);
  }

  return (
    <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
      <TopBar
        view={view}
        setView={setView}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        theme={theme}
        setTheme={setTheme}
      />
      <div style={{ display: 'flex', height: '100vh' }}>
        <LeftPanel
          countries={countries}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          bias={bias}
          setBias={setBias}
        />
        <div ref={mapContainerRef} style={{ flex: 1 }} />
        <RightPanel
          data={filteredData}
          selectedEmotions={selectedEmotions}
          setSelectedEmotions={setSelectedEmotions}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}

