const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const requestLog = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  if (requestLog.size > 5000) {
    for (const [key, times] of requestLog) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) requestLog.delete(key);
    }
  }
  return timestamps.length > RATE_LIMIT;
}

function buildPrompt(promptDef, input) {
  const inputLines = Object.entries(input || {})
    .filter(([, value]) => value !== '' && value !== null && value !== undefined)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
  return (
    `You are ${promptDef.role}. A user has provided the following details:\n\n${inputLines || '(no details provided)'}\n\n` +
    `Based on these details, produce a helpful, realistic, specific plan.\n` +
    `Respond with ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:\n${promptDef.shape}\n\n` +
    `Fill every field with real, useful content based on the details given. Use reasonable real-world assumptions ` +
    `where details are missing, and keep string values concise but concrete.`
  );
}

function extractJson(text) {
  const trimmed = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(trimmed);
}

const REQUEST_DEADLINE_MS = 28000;
async function fetchWithDeadline(url, options, deadlineAt) {
  const remaining = deadlineAt - Date.now();
  if (remaining <= 0) {
    throw new Error('The AI provider took too long to respond. It may be experiencing high demand - try again in a moment.');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), remaining);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('The AI provider took too long to respond. It may be experiencing high demand - try again in a moment.');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
async function parseJsonSafely(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
async function callAnthropic(prompt, deadlineAt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Anthropic is not configured on this server.');
  const res = await fetchWithDeadline('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }]
    })
  }, deadlineAt);
  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.error?.message || `Anthropic API error (${res.status})`);
  return data?.content?.[0]?.text?.trim() || '';
}
const GEMINI_MODEL_CANDIDATES = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
function isModelUnavailableError(message) {
  return /is no longer available|not found|deprecated|does not exist/i.test(message || '');
}
async function callGemini(prompt, deadlineAt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini is not configured on this server.');
  let lastError;
  for (const model of GEMINI_MODEL_CANDIDATES) {
    if (Date.now() >= deadlineAt) break;
    try {
      const res = await fetchWithDeadline(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        },
        deadlineAt
      );
      const data = await parseJsonSafely(res);
      if (!res.ok) {
        const message = data?.error?.message || `Gemini API error (${res.status})`;
        if (isModelUnavailableError(message)) {
          lastError = new Error(message);
          continue;
        }
        throw new Error(message);
      }
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    } catch (e) {
      if (e.message && isModelUnavailableError(e.message)) {
        lastError = e;
        continue;
      }
      throw e;
    }
  }
  throw lastError || new Error('The AI provider took too long to respond. It may be experiencing high demand - try again in a moment.');
}

export function createAgentHandler(agentKey, promptDef) {
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
      res.status(429).json({ error: `Rate limit reached (${RATE_LIMIT} requests per hour). Try again later, or connect your own API key in the tool for unlimited use.` });
      return;
    }
    const { input, provider } = req.body || {};
    if (provider !== undefined && provider !== 'anthropic' && provider !== 'gemini') {
      res.status(400).json({ error: 'Invalid "provider" - must be "anthropic" or "gemini".' });
      return;
    }
    const effectiveProvider = provider || 'anthropic';
    const deadlineAt = Date.now() + REQUEST_DEADLINE_MS;
    const prompt = buildPrompt(promptDef, input);
    try {
      const raw = effectiveProvider === 'anthropic'
        ? await callAnthropic(prompt, deadlineAt)
        : await callGemini(prompt, deadlineAt);
      if (!raw) {
        res.status(502).json({ error: 'The model returned an empty response. Try again.' });
        return;
      }
      let result;
      try {
        result = extractJson(raw);
      } catch {
        result = { summary: raw };
      }
      res.status(200).json(result);
    } catch (e) {
      res.status(502).json({ error: e.message || 'Something went wrong calling the AI provider.' });
    }
  };
}
