import { db } from '../../../server/db.fake';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(db.getUser());
    return;
  }
  if (req.method === 'PATCH') {
    res.status(200).json(db.patchUser(req.body || {}));
    return;
  }
  if (req.method === 'DELETE') {
    res.status(204).end();
    return;
  }
  res.status(405).end();
}
