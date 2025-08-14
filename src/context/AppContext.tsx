import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

export type ContentType = 'video' | 'live';
export type EmotionColor = 'jaune' | 'bleu' | 'rouge' | 'vert' | 'orange' | 'noir';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  emotion: EmotionColor;
  country: string;
  coords: { lat: number; lng: number };
  flags?: string[];
}

interface AppState {
  mode: ContentType;
  selectedCountry: string | null;
  selectedFlag: string | null;
  emotions: Record<EmotionColor, boolean>;
  contents: ContentItem[];
  focus: { lat: number; lng: number } | null;
  theme: 'light' | 'dark';
  mapStyle: 'standard' | 'satellite';
  setMode: (m: ContentType) => void;
  setCountry: (c: string | null) => void;
   setFlag: (f: string | null) => void;
  setFocus: (c: { lat: number; lng: number } | null) => void;
  toggleEmotion: (e: EmotionColor) => void;
  toggleTheme: () => void;
  toggleMapStyle: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children, initialContents }: { children: ReactNode; initialContents: ContentItem[] }) => {
  const [mode, setMode] = useState<ContentType>('video');
  const [selectedCountry, setCountry] = useState<string | null>(null);
  const [selectedFlag, setFlag] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<Record<EmotionColor, boolean>>({
    jaune: true,
    bleu: true,
    rouge: true,
    vert: true,
    orange: true,
    noir: true,
  });
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');

  const toggleEmotion = (e: EmotionColor) => setEmotions(prev => ({ ...prev, [e]: !prev[e] }));
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const toggleMapStyle = () => setMapStyle(m => (m === 'standard' ? 'satellite' : 'standard'));

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.theme = theme;
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      mode,
      selectedCountry,
      selectedFlag,
      emotions,
      contents: initialContents,
      focus,
      theme,
      mapStyle,
      setMode,
      setCountry,
      setFlag,
      setFocus,
      toggleEmotion,
      toggleTheme,
      toggleMapStyle,
    }),
    [mode, selectedCountry, selectedFlag, emotions, focus, theme, mapStyle, initialContents]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
};
