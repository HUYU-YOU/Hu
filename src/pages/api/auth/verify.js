// /pages/api/auth/verify.js
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();
  const { method, phone, code, token } = req.body || {};

  if(method === 'phone'){
    if(!phone || !code) return res.status(400).send('Paramètres manquants');
    if(code !== '123456') return res.status(401).send('Code invalide');
    return res.status(200).json({ ok:true, humanId:'h_01' });
  }

  if(method === 'email'){
    if(!token) return res.status(400).send('Token manquant');
    return res.status(200).json({ ok:true, humanId:'h_01' });
  }

  return res.status(400).send('Méthode invalide');
}
