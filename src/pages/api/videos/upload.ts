import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/server/db.fake';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const id = `p_${Math.floor(Math.random() * 1e6)}`;
  const { color = 'jaune', type = 'video', title = 'Nouveau post', lat = 48.85, lng = 2.35, country = 'FR', flagTags = [] } = req.body || {};
  db.addPoint({ id, color, type, title, lat, lng, country, flagTags, ts: Date.now() });
  res.status(201).json({ video_id: id });
}
