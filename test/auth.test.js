const test = require('node:test');
const assert = require('node:assert');
const { buildServer } = require('../server');

function request(base, path, options={}) {
  return fetch(base + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers||{}) },
  });
}

test('register, login, logout flow', async (t) => {
  const server = buildServer().listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const port = server.address().port;
  const base = `http://localhost:${port}`;

  let res = await request(base, '/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email: 'a@example.com', password: 'Secret123!', pseudonym: 'Nova' })
  });
  assert.equal(res.status, 200);

  res = await request(base, '/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'a@example.com', password: 'Secret123!' })
  });
  assert.equal(res.status, 200);
  const cookie = res.headers.get('set-cookie');
  assert(cookie.includes('token='));

  res = await request(base, '/users/me', { headers: { Cookie: cookie } });
  assert.equal(res.status, 200);
  const me = await res.json();
  assert.equal(me.email, 'a@example.com');

  res = await request(base, '/auth/logout', { method: 'POST', headers: { Cookie: cookie } });
  assert.equal(res.status, 200);

  res = await request(base, '/users/me', { headers: { Cookie: cookie } });
  assert.equal(res.status, 401);

  server.close();
});
