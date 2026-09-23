import { createComputeHandler } from '../_lib/computeHandler.js';

function tokenizePath(path) {
  const trimmed = path.trim();
  if (!trimmed.startsWith('$')) {
    throw new Error('Path must start with "$".');
  }
  const rest = trimmed.slice(1);
  const tokens = [];
  const re = /\.([A-Za-z0-9_$]+)|\[(\*)\]|\['([^']*)'\]|\["([^"]*)"\]|\[(-?\d+)\]/g;
  let lastIndex = 0;
  let match;
  while ((match = re.exec(rest)) !== null) {
    if (match.index !== lastIndex) {
      throw new Error(`Unrecognized path syntax near "${rest.slice(lastIndex)}".`);
    }
    if (match[1] !== undefined) tokens.push({ type: 'key', value: match[1] });
    else if (match[2] !== undefined) tokens.push({ type: 'wildcard' });
    else if (match[3] !== undefined) tokens.push({ type: 'key', value: match[3] });
    else if (match[4] !== undefined) tokens.push({ type: 'key', value: match[4] });
    else if (match[5] !== undefined) tokens.push({ type: 'index', value: Number(match[5]) });
    lastIndex = re.lastIndex;
  }
  if (lastIndex !== rest.length) {
    throw new Error(`Unrecognized path syntax near "${rest.slice(lastIndex)}".`);
  }
  return tokens;
}

function evaluatePath(data, tokens) {
  let current = [data];
  for (const token of tokens) {
    const next = [];
    for (const value of current) {
      if (value === null || value === undefined) continue;
      if (token.type === 'key') {
        if (typeof value === 'object' && token.value in value) next.push(value[token.value]);
      } else if (token.type === 'index') {
        if (Array.isArray(value)) {
          const idx = token.value < 0 ? value.length + token.value : token.value;
          if (idx >= 0 && idx < value.length) next.push(value[idx]);
        }
      } else if (token.type === 'wildcard') {
        if (Array.isArray(value)) next.push(...value);
        else if (typeof value === 'object') next.push(...Object.values(value));
      }
    }
    current = next;
  }
  return current;
}

function compute({ jsonInput, path }) {
  let data;
  try {
    data = JSON.parse(jsonInput);
  } catch {
    throw new Error('Invalid JSON input.');
  }
  if (!path || !path.trim()) return { matches: [] };
  const tokens = tokenizePath(path);
  const matches = evaluatePath(data, tokens);
  return { matches };
}

export default createComputeHandler(compute);
