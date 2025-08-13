type UserPrefs = {
  id: string;
  email: string;
  pseudonym: string | null;
  anonymity: boolean;
  consents: { personalization: boolean; analytics: boolean };
  flags: string[];
  convictions: string[];
  top_colors: Record<string, number>;
  theme: "auto" | "light" | "dark";
  reduceMotion: boolean;
  map: { density: number; rotation: number; prioritizeSOS: boolean; sort: "recent" | "trend_24h" | "nearby" };
  notifs: { web: boolean; email: boolean };
  safety: { sensitiveFilter: boolean; autoBlurBeep: boolean };
  locale: { lang: "fr" | "en" | "es"; country: string };
};

export type GlobePoint = {
  id: string;
  type: "video" | "live" | "defis" | "quiz";
  color: "jaune" | "bleu" | "rouge" | "vert" | "orange" | "noir";
  title: string;
  country: string;
  flagTags?: string[];
  lat: number;
  lng: number;
  ts: number;
};

const fakeUser: UserPrefs = {
  id: "u_001",
  email: "nova@example.com",
  pseudonym: "Nova",
  anonymity: true,
  consents: { personalization: true, analytics: true },
  flags: ["FR", "PRIDE"],
  convictions: ["écologie"],
  top_colors: { jaune: 0.45, bleu: 0.25, vert: 0.15, rouge: 0.08, orange: 0.05, noir: 0.02 },
  theme: "auto",
  reduceMotion: false,
  map: { density: 1, rotation: 0.5, prioritizeSOS: true, sort: "trend_24h" },
  notifs: { web: false, email: true },
  safety: { sensitiveFilter: true, autoBlurBeep: true },
  locale: { lang: "fr", country: "FR" }
};

let points: GlobePoint[] = [];
for (let i = 0; i < 400; i++) {
  const colors = ["jaune", "bleu", "rouge", "vert", "orange", "noir"] as const;
  const color = colors[Math.floor(Math.random() * colors.length)];
  points.push({
    id: `p_${i}`,
    type: Math.random() < 0.75 ? "video" : "live",
    color,
    title: `${color} #${i}`,
    country: ["FR", "US", "JP", "BR", "MA", "UA"][Math.floor(Math.random() * 6)],
    flagTags: Math.random() < 0.15 ? ["PRIDE"] : [],
    lat: Math.random() * 180 - 90,
    lng: Math.random() * 360 - 180,
    ts: Date.now() - Math.floor(Math.random() * 86_400_000)
  });
}

export const db = {
  getUser() {
    return fakeUser;
  },
  patchUser(p: Partial<UserPrefs>) {
    Object.assign(fakeUser, p);
    return fakeUser;
  },
  getPoints(filter: { types?: string[]; colors?: string[]; flags?: string[]; sort?: "recent" | "trend_24h" | "nearby" }) {
    let out = points.slice();
    if (filter.types?.length) out = out.filter(p => filter.types!.includes(p.type));
    if (filter.colors?.length) out = out.filter(p => filter.colors!.includes(p.color));
    if (filter.flags?.length) out = out.filter(p => p.flagTags?.some(t => filter.flags!.includes(t)));
    if (filter.sort === "recent") out.sort((a, b) => b.ts - a.ts);
    if (filter.sort === "trend_24h") out.sort((a, b) => (b.ts % 1000) - (a.ts % 1000));
    return out;
  },
  addPoint(p: GlobePoint) {
    points.unshift(p);
  }
};

export type { UserPrefs };
