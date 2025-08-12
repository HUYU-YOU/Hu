const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');
const { parseBody, send } = require('./lib/httpUtils');

// In-memory store
const users = new Map(); // key: id, value: user object
const sessions = new Map(); // key: token, value: userId

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hashed = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hashed}`;
}

function verifyPassword(password, hashed) {
  const [salt, key] = hashed.split(':');
  const hashVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return key === hashVerify;
}

function createToken(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, userId);
  return token;
}

function parseCookies(req) {
  return Object.fromEntries((req.headers['cookie'] || '').split(';').filter(Boolean).map(c => {
    const [k, v] = c.trim().split('=');
    return [k, v];
  }));
}

function getUserFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies['token'];
  if (token && sessions.has(token)) {
    const userId = sessions.get(token);
    return users.get(userId);
  }
  return null;
}

function buildServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    try {
    if (req.method === 'POST' && url.pathname === '/auth/register') {
      const body = await parseBody(req);
      const { email, password, pseudonym } = body;
      if (!email || !password) {
        return send(res, 400, { error: 'Email and password required' });
      }
      if ([...users.values()].some(u => u.email === email)) {
        return send(res, 409, { error: 'Email already used' });
      }
      const id = crypto.randomUUID();
      const passwordHash = hashPassword(password);
      const user = { id, email, passwordHash, pseudonym: pseudonym || null };
      users.set(id, user);
      return send(res, 200, { user: { id, email, pseudonym: user.pseudonym } });
    }

    if (req.method === 'POST' && url.pathname === '/auth/login') {
      const body = await parseBody(req);
      const { email, password } = body;
      if (!email || !password) {
        return send(res, 400, { error: 'Email and password required' });
      }
      const user = [...users.values()].find(u => u.email === email);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        return send(res, 401, { error: 'Invalid credentials' });
      }
      const token = createToken(user.id);
      return send(
        res,
        200,
        { user: { id: user.id, email: user.email, pseudonym: user.pseudonym } },
        [`token=${token}; HttpOnly`]
      );
    }

    if (req.method === 'POST' && url.pathname === '/auth/logout') {
      const cookies = parseCookies(req);
      const token = cookies['token'];
      if (token) sessions.delete(token);
      return send(res, 200, { ok: true }, ['token=; HttpOnly; Max-Age=0']);
    }

    if (req.method === 'GET' && url.pathname === '/users/me') {
      const user = getUserFromRequest(req);
      if (!user) return send(res, 401, { error: 'Unauthenticated' });
      return send(res, 200, { id: user.id, email: user.email, pseudonym: user.pseudonym });
    }

    if (req.method === 'GET' && url.pathname.startsWith('/users/')) {
      const id = url.pathname.split('/')[2];
      const user = users.get(id);
      if (!user) return send(res, 404, { error: 'Not found' });
      return send(res, 200, { id: user.id, pseudonym: user.pseudonym });
    }

    send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: 'Server error' });
  }
  });
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = buildServer();
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = { buildServer };
