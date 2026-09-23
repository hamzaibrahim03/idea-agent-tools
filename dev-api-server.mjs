import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

try {
  const envText = readFileSync('.env.local', 'utf8');
  for (const line of envText.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch {
  console.warn('[dev-api] No .env.local found - ANTHROPIC_API_KEY/GEMINI_API_KEY will be unset.');
}

const toolsDispatcher = (await import('./api/tools/[slug].js')).default;
const agentsDispatcher = (await import('./api/agents/[agent].js')).default;
const generatePromptHandler = (await import('./api/generate-prompt.js')).default;

const PORT = process.env.DEV_API_PORT || 3001;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const segments = url.pathname.split('/').filter(Boolean);

  let handler = null;
  let query = {};
  if (url.pathname === '/api/generate-prompt') {
    handler = generatePromptHandler;
  } else if (segments[0] === 'api' && segments[1] === 'tools' && segments[2]) {
    handler = toolsDispatcher;
    query = { slug: segments[2] };
  } else if (segments[0] === 'api' && segments[1] === 'agents' && segments[2]) {
    handler = agentsDispatcher;
    query = { agent: segments[2] };
  }

  if (!handler) {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', async () => {
    try {
      req.body = body ? JSON.parse(body) : {};
    } catch {
      req.body = {};
    }
    req.query = query;
    const shimRes = {
      statusCode: 200,
      status(code) { this.statusCode = code; return this; },
      json(data) {
        res.writeHead(this.statusCode, { 'content-type': 'application/json' });
        res.end(JSON.stringify(data));
      },
    };
    try {
      await handler(req, shimRes);
    } catch (e) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: e.message || 'Internal server error' }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`[dev-api] Local API server running at http://localhost:${PORT} (dynamic dispatch: /api/tools/*, /api/agents/*, /api/generate-prompt)`);
});
