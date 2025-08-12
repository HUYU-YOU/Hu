const fakeUser = {
  id: 'u_001',
  email: 'nova@example.com',
  pseudonym: 'Nova',
  anonymity: true,
  consents: { personalization: true, analytics: true },
  flags: ['FR', 'PRIDE'],
  convictions: ['écologie'],
  top_colors: { jaune: 0.45, bleu: 0.25, vert: 0.15, rouge: 0.08, orange: 0.05, noir: 0.02 },
  theme: 'auto',
  reduceMotion: false,
  map: { density: 1, rotation: 0.5, prioritizeSOS: true, sort: 'trend_24h' },
  notifs: { web: false, email: true },
  safety: { sensitiveFilter: true, autoBlurBeep: true },
  locale: { lang: 'fr', country: 'FR' },
};

const colors = ['jaune','bleu','rouge','vert','orange','noir'];
const countries = ['FR','US','JP','BR','MA','UA'];
const points = Array.from({ length: 400 }, (_, i) => {
  const color = colors[Math.floor(Math.random()*colors.length)];
  return {
    id: `p_${i}`,
    type: Math.random() < 0.75 ? 'video' : 'live',
    color,
    title: `${color} #${i}`,
    country: countries[Math.floor(Math.random()*countries.length)],
    flagTags: Math.random() < 0.15 ? ['PRIDE'] : [],
    lat: (Math.random()*180)-90,
    lon: (Math.random()*360)-180,
    ts: Date.now() - Math.floor(Math.random()*86_400_000),
  };
});

export const db = {
  getUser() { return fakeUser; },
  patchUser(p) { Object.assign(fakeUser, p); return fakeUser; },
  getPoints(filter = {}) {
    let out = points.slice();
    if (filter.types && filter.types.length) out = out.filter(p => filter.types.includes(p.type));
    if (filter.colors && filter.colors.length) out = out.filter(p => filter.colors.includes(p.color));
    if (filter.flags && filter.flags.length) out = out.filter(p => p.flagTags && p.flagTags.some(t => filter.flags.includes(t)));
    if (filter.country) out = out.filter(p => p.country === filter.country);
    if (filter.sort === 'recent') out.sort((a,b)=> b.ts - a.ts);
    if (filter.sort === 'trend_24h') out.sort((a,b)=> (b.ts%1000)-(a.ts%1000));
    return out;
  },
  addPoint(p) { points.unshift(p); },
};
