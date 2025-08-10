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
    <div className="login">
      <form onSubmit={submit} className="loginForm">
        <h1 className="loginTitle">hu.</h1>
        <input
          className="loginInput"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Votre nom"
          required
        />
        <button type="submit" className="loginButton">
          Entrer
        </button>
      </form>
    </div>
  );
}
