import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/server/db.fake';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') return res.status(200).json(db.getUser());
  if (req.method === 'PATCH') return res.status(200).json(db.patchUser(req.body || {}));
  if (req.method === 'DELETE') return res.status(204).end();
  res.status(405).end();
}
