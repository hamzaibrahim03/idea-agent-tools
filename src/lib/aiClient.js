const UPSTREAM_TIMEOUT_MS = 20000;
async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
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
export async function callAnthropicDirect(apiKey, prompt, { maxTokens = 1024 } = {}) {
  const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.error?.message || `Anthropic API error (${res.status})`);
  return data?.content?.[0]?.text?.trim() || '';
}
const GEMINI_MODEL_CANDIDATES = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
function isModelUnavailableError(message) {
  return /is no longer available|not found|deprecated|does not exist/i.test(message || '');
}
export async function callGeminiDirect(apiKey, prompt) {
  let lastError;
  for (const model of GEMINI_MODEL_CANDIDATES) {
    try {
      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
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
  throw lastError || new Error('No Gemini model candidate is currently available.');
}
const SERVER_FUNCTION_TIMEOUT_MS = 28000;
export async function callServerFunction(endpoint, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SERVER_FUNCTION_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('The AI provider took too long to respond. It may be experiencing high demand - try again in a moment.');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(
      data?.error ||
      (res.status === 0 || !data
        ? 'The server returned an unexpected empty response. Please try again.'
        : `Server error (${res.status})`)
    );
  }
  return data;
}
export function extractJsonFromText(text) {
  const trimmed = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(trimmed);
}
