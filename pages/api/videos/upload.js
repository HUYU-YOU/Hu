import { db } from '../../../server/db.fake';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const id = `p_${Math.floor(Math.random()*1e6)}`;
  const {
    color = 'jaune',
    type = 'video',
    title = 'Nouveau post',
    lat = 48.85,
    lon = 2.35,
    country = 'FR',
    flagTags = [],
  } = req.body || {};
  db.addPoint({ id, color, type, title, lat, lon, country, flagTags, ts: Date.now() });
  res.status(201).json({ video_id: id });
}
