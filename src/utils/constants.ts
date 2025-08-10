import { EmotionColor } from '@/context/AppContext';

export const emotionColors = {
  yellow: { hex: '#FFD400', label: 'joie & créativité', emoji: '😊' },
  blue: { hex: '#2F80ED', label: 'curiosité & apprendre', emoji: '🧠' },
  red: { hex: '#EB5757', label: 'colère & révolution', emoji: '🔥' },
  green: { hex: '#27AE60', label: 'nature & apaisement', emoji: '🌿' },
  orange: { hex: '#F2994A', label: 'énergie', emoji: '⚡' },
  black: { hex: '#111111', label: "besoin d'aide urgente", emoji: '🆘' },
} as const;

export type EmotionName = keyof typeof emotionColors;

export const emotionHex: Record<EmotionColor, string> = {
  jaune: emotionColors.yellow.hex,
  bleu: emotionColors.blue.hex,
  rouge: emotionColors.red.hex,
  vert: emotionColors.green.hex,
  orange: emotionColors.orange.hex,
  noir: emotionColors.black.hex,
};
