import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

export type ContentType = 'video' | 'live';
export type EmotionColor = 'jaune' | 'bleu' | 'rouge' | 'vert' | 'orange' | 'noir';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  emotion: EmotionColor;
  country: string;
  coords: { lat: number; lng: number };
}

interface AppState {
  user: string | null;
  mode: ContentType;
  selectedCountry: string | null;
  bias: boolean;
  emotions: Record<EmotionColor, boolean>;
  contents: ContentItem[];
  focus: { lat: number; lng: number } | null;
  setUser: (u: string | null) => void;
  setMode: (m: ContentType) => void;
  setCountry: (c: string | null) => void;
  setFocus: (c: { lat: number; lng: number } | null) => void;
  toggleBias: () => void;
  toggleEmotion: (e: EmotionColor) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children, initialContents }: { children: ReactNode; initialContents: ContentItem[] }) => {
  const [user, setUser] = useState<string | null>(null);
  const [mode, setMode] = useState<ContentType>('video');
  const [selectedCountry, setCountry] = useState<string | null>(null);
  const [bias, setBias] = useState(false);
  const [emotions, setEmotions] = useState<Record<EmotionColor, boolean>>({
    jaune: true,
    bleu: true,
    rouge: true,
    vert: true,
    orange: true,
    noir: true,
  });
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);

  const toggleBias = () => setBias(b => !b);
  const toggleEmotion = (e: EmotionColor) => setEmotions(prev => ({ ...prev, [e]: !prev[e] }));

  const value = useMemo(
    () => ({
      user,
      mode,
      selectedCountry,
      bias,
      emotions,
      contents: initialContents,
      focus,
      setUser,
      setMode,
      setCountry,
      setFocus,
      toggleBias,
      toggleEmotion,
    }),
    [user, mode, selectedCountry, bias, emotions, focus, initialContents]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
};
