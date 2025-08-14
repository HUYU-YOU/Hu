import { useState } from 'react';
import { signIn } from 'next-auth/react';
import '@/styles/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    await signIn('credentials', { email, password, callbackUrl: '/' });
  }

  return (
    <main className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Connexion</h1>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Se connecter</button>
        <div className="foot">
          <button type="button" className="link" onClick={() => (window.location.href = '/')}>← Retour au globe</button>
        </div>
      </form>
    </main>
  );
}
