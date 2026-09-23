import { createComputeHandler } from '../computeHandler.js';

function truncateByChars(text, limit, suffix) {
  if (text.length <= limit) return text;
  const cut = Math.max(0, limit - suffix.length);
  return text.slice(0, cut).trimEnd() + suffix;
}
function truncateByWords(text, limit, suffix) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(' ') + suffix;
}

function compute({ input, mode, limit, suffix }) {
  const text = String(input || '');
  const safeLimit = Math.max(1, Number(limit) || 1);
  const suf = suffix ?? '';
  const output = !text
    ? ''
    : mode === 'words'
      ? truncateByWords(text, safeLimit, suf)
      : truncateByChars(text, safeLimit, suf);
  return { output };
}

export default createComputeHandler(compute);
