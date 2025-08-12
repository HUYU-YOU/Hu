import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/server/db.fake';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const user = db.getUser();
  user.consents = { ...user.consents, ...(req.body || {}) };
  res.status(200).json(user.consents);
}
