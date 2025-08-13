import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/server/db.fake';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { types, colors, flags, sort, limit } = req.query;
  const parse = (v: any) => (typeof v === 'string' ? v.split(',').filter(Boolean) : undefined);
  const data = db.getPoints({
    types: parse(types),
    colors: parse(colors),
    flags: parse(flags),
    sort: (sort as any) || 'trend_24h'
  });
  const lim = Number(limit || 500);
  res.status(200).json(data.slice(0, lim));
}
