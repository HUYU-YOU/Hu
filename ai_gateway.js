const http = require('http');
const { URL } = require('url');
const { parseBody, send } = require('./lib/httpUtils');
const moderate = require('./services/moderation_service');
const classify = require('./services/classification_service');
const recommend = require('./services/recommender_service');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === 'POST' && url.pathname === '/moderate') {
      const body = await parseBody(req);
      const result = await moderate(body);
      return send(res, 200, result);
    }
    if (req.method === 'POST' && url.pathname === '/classify') {
      const body = await parseBody(req);
      const result = await classify(body);
      return send(res, 200, result);
    }
    if (req.method === 'POST' && url.pathname === '/recommend') {
      const body = await parseBody(req);
      const result = await recommend(body);
      return send(res, 200, result);
    }
    if (req.method === 'POST' && url.pathname === '/feedback') {
      await parseBody(req); // ignore content
      return send(res, 200, { status: 'ok' });
    }
    send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: 'Server error' });
  }
});

const PORT = process.env.AI_PORT || 4000;
server.listen(PORT, () => {
  console.log(`AI Gateway running on http://localhost:${PORT}`);
});
