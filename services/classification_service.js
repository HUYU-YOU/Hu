const colors = ['jaune','bleu','rouge','vert','orange','noir','violet'];
const categoriesPool = ['musique','éducation','sport'];

function randomScores() {
  const scores = {};
  colors.forEach(c => { scores[c] = Math.random(); });
  return scores;
}

module.exports = async function classify(payload) {
  let decisionNote = 'user_choice_prioritized=false';
  if (payload.user_color_choice && payload.fallback_use_user_choice) {
    decisionNote = 'user_choice_prioritized=true';
    return {
      emotion: payload.user_color_choice,
      scores: randomScores(),
      categories: ['éducation'],
      confidence: 0.7,
      decision_note: decisionNote,
    };
  }
  const scores = randomScores();
  const emotion = Object.keys(scores).reduce((a,b) => scores[a] > scores[b] ? a : b);
  return {
    emotion,
    scores,
    categories: [categoriesPool[Math.floor(Math.random()*categoriesPool.length)]],
    confidence: scores[emotion],
    decision_note: decisionNote,
  };
};
