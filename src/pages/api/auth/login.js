// /pages/api/auth/login.js
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();
  const { method, email, phone } = req.body || {};

  if(method === 'email'){
    if(!email || !/.+@.+\..+/.test(email)) return res.status(400).send('Email invalide');
    return res.status(200).json({ ok:true, kind:'magic_link_sent' });
  }

  if(method === 'phone'){
    if(!phone || !/^\+\d{6,15}$/.test(phone)) return res.status(400).send('Téléphone invalide (format E.164)');
    return res.status(200).json({ ok:true, kind:'otp_sent' });
  }

  return res.status(400).send('Méthode invalide');
}
