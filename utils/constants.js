export const emotions = {
  joy: {
    color: '#FFD400',
    label: 'Joy / Creativity',
    emoji: '😊',
  },
  curiosity: {
    color: '#2F80ED',
    label: 'Curiosity / Learning',
    emoji: '🧠',
  },
  anger: { color: '#EB5757', label: 'Anger / Revolution', emoji: '🔥' },
  calm: { color: '#27AE60', label: 'Nature / Calm', emoji: '🌿' },
  energy: { color: '#F2994A', label: 'Energy', emoji: '⚡' },
  help: { color: '#111111', label: 'Urgent Help', emoji: '🆘' },
};

export const emotionKeys = Object.keys(emotions);

// Backwards-compatibility export used by older components
export const emotionColors = emotions;
