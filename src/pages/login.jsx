import { useState } from 'react';
import { signIn } from 'next-auth/react';
import '../styles/login.css';

export default function LoginPage() {
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState({ loading:false, msg:null, err:null });
  const [otpSent, setOtpSent] = useState(false);

  async function sendMagicLink(e){
    e.preventDefault();
    setStatus({ loading:true, msg:null, err:null });
    try {
      const r = await fetch('/api/auth/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ method:'email', email })
      });
      if(!r.ok) throw new Error(await r.text());
      setStatus({ loading:false, msg:'Vérifie ta boîte mail pour le lien de connexion.', err:null });
    } catch (e) {
      setStatus({ loading:false, msg:null, err:e.message || 'Erreur' });
    }
  }

  async function sendOtp(e){
    e.preventDefault();
    setStatus({ loading:true, msg:null, err:null });
    try {
      const r = await fetch('/api/auth/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ method:'phone', phone })
      });
      if(!r.ok) throw new Error(await r.text());
      setOtpSent(true);
      setStatus({ loading:false, msg:'Code envoyé par SMS.', err:null });
    } catch (e) {
      setStatus({ loading:false, msg:null, err:e.message || 'Erreur' });
    }
  }

  async function verifyOtp(e){
    e.preventDefault();
    setStatus({ loading:true, msg:null, err:null });
    try {
      const r = await fetch('/api/auth/verify', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ method:'phone', phone, code })
      });
      if(!r.ok) throw new Error(await r.text());
      window.location.href = '/profile';
    } catch (e) {
      setStatus({ loading:false, msg:null, err:e.message || 'Code invalide' });
    }
  }

  return (
    <main className="login-shell">
      <div className="login-card" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <h1 id="login-title">Connexion</h1>

        <div className="tabs" role="tablist" aria-label="Méthode de connexion">
          <button
            role="tab"
            aria-selected={tab==='email'}
            className={tab==='email'?'active':''}
            onClick={()=>setTab('email')}
          >Email</button>
          <button
            role="tab"
            aria-selected={tab==='phone'}
            className={tab==='phone'?'active':''}
            onClick={()=>setTab('phone')}
          >Téléphone</button>
        </div>

        {tab==='email' && (
          <form onSubmit={sendMagicLink} aria-label="Connexion par email">
            <label>
              Email
              <input
                type="email"
                required
                placeholder="toi@hu.app"
                value={email}
                onChange={e=>setEmail(e.target.value)}
              />
            </label>
            <button type="submit" disabled={status.loading || !email}>Envoyer le lien</button>
          </form>
        )}

        {tab==='phone' && (
          <form onSubmit={otpSent ? verifyOtp : sendOtp} aria-label="Connexion par téléphone">
            <label>
              Téléphone (E.164)
              <input
                type="tel"
                required
                placeholder="+33600000000"
                value={phone}
                onChange={e=>setPhone(e.target.value)}
              />
            </label>

            {otpSent && (
              <label>
                Code reçu
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={code}
                  onChange={e=>setCode(e.target.value)}
                />
              </label>
            )}

            <button type="submit" disabled={status.loading || !phone || (otpSent && code.length<4)}>
              {otpSent ? 'Vérifier le code' : 'Recevoir le code'}
            </button>
          </form>
        )}

        {status.err && <p className="alert error" role="alert">{status.err}</p>}
        {status.msg && <p className="alert ok" role="status">{status.msg}</p>}

        <div style={{ marginTop: 16 }}>
          <button onClick={() => signIn('google', { callbackUrl: '/profile' })}>
            Se connecter avec Google
          </button>
        </div>

        <div className="foot">
          <button className="link" onClick={()=>window.location.href='/'}>← Retour au globe</button>
        </div>
      </div>
    </main>
  );
}
