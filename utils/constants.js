export const emotions = {
  joy: { color: '#FFD400', label: 'Joy / Creativity' },
  curiosity: { color: '#2F80ED', label: 'Curiosity / Learning' },
  anger: { color: '#EB5757', label: 'Anger / Revolution' },
  calm: { color: '#27AE60', label: 'Nature / Calm' },
  energy: { color: '#F2994A', label: 'Energy' },
  help: { color: '#111111', label: 'Urgent Help' },
};

export const emotionKeys = Object.keys(emotions);

// Backwards-compatibility export used by older components
export const emotionColors = emotions;
