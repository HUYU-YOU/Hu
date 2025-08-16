const contents = require('../data/contents.json');

module.exports = async function recommend(payload) {
  const limit = payload.limit || 40;
  let items = contents;
  if (payload.filters) {
    const { types = [], colors = [], flags = [] } = payload.filters;
    items = items.filter(it => {
      if (types.length && !types.includes(it.type)) return false;
      if (colors.length && !colors.includes(it.color)) return false;
      if (flags.length && !flags.includes(it.country)) return false;
      return true;
    });
  }
  items = items.slice(0, limit).map(it => ({
    video_id: `vid_${it.id}`,
    score: 0.9,
    color: it.color,
    country: it.country,
    categories: ['musique'],
  }));
  return {
    items,
    explanations: ['stub recommendations'],
  };
};
