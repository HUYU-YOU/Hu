import { db } from '../../server/db.fake';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const user = db.getUser();
  user.consents = { ...user.consents, ...(req.body || {}) };
  res.status(200).json(user.consents);
}
