import { createComputeHandler } from '../computeHandler.js';

function parseEnv(text) {
  const rows = [];
  const lines = text.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) rows.push({ key, value });
  }
  return rows;
}
function rowsToEnv(rows) {
  return rows
    .filter((r) => r.key.trim())
    .map((r) => `${r.key.trim()}=${/\s|#/.test(r.value) ? `"${r.value}"` : r.value}`)
    .join('\n');
}

function compute({ input, rows }) {
  const parsedRows = parseEnv(input || '');
  const generatedEnv = rowsToEnv(rows || []);
  return { parsedRows, generatedEnv };
}

export default createComputeHandler(compute);
