import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppState } from '@/context/AppContext';

export default function Login() {
  const [name, setName] = useState('');
  const { setUser } = useAppState();
  const router = useRouter();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setUser(name);
    router.push('/');
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
      <h1>Connexion</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" required />
      <button type="submit">Entrer</button>
    </form>
  );
}
