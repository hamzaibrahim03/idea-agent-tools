import { createServer } from 'node:http';
import { readFileSync, readdirSync } from 'node:fs';

try {
  const envText = readFileSync('.env.local', 'utf8');
  for (const line of envText.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch {
  console.warn('[dev-api] No .env.local found - ANTHROPIC_API_KEY/GEMINI_API_KEY will be unset.');
}

const routes = {};

async function registerDir(dir, prefix) {
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.js'));
  } catch {
    return;
  }
  for (const file of files) {
    const slug = file.replace(/\.js$/, '');
    const mod = await import(`./${dir}/${file}`);
    routes[`${prefix}/${slug}`] = mod.default;
  }
}

await registerDir('api/agents', '/api/agents');
await registerDir('api/tools', '/api/tools');
routes['/api/generate-prompt'] = (await import('./api/generate-prompt.js')).default;

const PORT = process.env.DEV_API_PORT || 3001;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const handler = routes[url.pathname];
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
  const routeCount = Object.keys(routes).length;
  console.log(`[dev-api] Local API server running at http://localhost:${PORT} (${routeCount} routes: ${Object.keys(routes).slice(0, 5).join(', ')}, ...)`);
});
