const bannedWords = ['haine', 'violence', 'harcèlement', 'nudité', 'suicide', 'spam'];

module.exports = async function moderate(payload) {
  const text = (payload.text || '').toLowerCase();
  const found = bannedWords.filter(w => text.includes(w));
  if (found.length) {
    return {
      risk_labels: ['harassment'],
      confidence: { harassment: 0.8 },
      action: 'hold',
      user_message: 'Contenu potentiellement problématique. Merci de reformuler.',
      explanations: found.map(w => `mot clé détecté: ${w}`),
      review_required: false,
    };
  }
  return {
    risk_labels: [],
    confidence: {},
    action: 'allow',
    user_message: 'Aucun problème détecté.',
    explanations: [],
    review_required: false,
  };
};
