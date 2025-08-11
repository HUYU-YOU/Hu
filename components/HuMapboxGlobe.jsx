import { useMemo, useState } from 'react';
import TopBar from './TopBar.jsx';
import RightPanel from './RightPanel.jsx';
import { emotions, emotionKeys } from '../utils/constants.js';
import { sampleData } from '../data/sampleData.js';
import { useMapboxGlobe } from '../hooks/useMapboxGlobe.js';

export default function HuMapboxGlobe() {
  const [view, setView] = useState('video');
  const [selectedEmotions, setSelectedEmotions] = useState(emotionKeys);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mapStyle, setMapStyle] = useState('light');
  const [theme, setTheme] = useState('dark');

  const countries = useMemo(() => {
    return Array.from(new Set(sampleData.map((d) => d.country))).sort();
  }, []);

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
    <div className={`app ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <TopBar
        view={view}
        setView={setView}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        theme={theme}
        setTheme={setTheme}
        countries={countries}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapContainerRef} className="map-container" />
        </div>
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

