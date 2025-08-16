import { db } from '../../../server/db.fake';

export default function handler(req, res) {
  const { types, colors, flags, sort, country } = req.query;
  const parse = (v) => (typeof v === 'string' ? v.split(',').filter(Boolean) : undefined);
  const data = db.getPoints({
    types: parse(types),
    colors: parse(colors),
    flags: parse(flags),
    country: country || undefined,
    sort: sort || 'trend_24h',
  });
  const limit = Number(req.query.limit || 500);
  res.status(200).json(data.slice(0, limit));
}
