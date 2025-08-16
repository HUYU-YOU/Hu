import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const r = await fetch('/api/users/me');
    const j = await r.json();
    setUser(j);
    setLoading(false);
  }

  async function patch(body) {
    const r = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    setUser(j);
    return j;
  }

  useEffect(() => {
    refresh();
  }, []);

  return { user, loading, refresh, patch };
}
