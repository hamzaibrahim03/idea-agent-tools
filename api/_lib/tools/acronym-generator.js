import { createComputeHandler } from '../computeHandler.js';

const SMALL_WORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'by', 'for', 'to', 'and', 'or', 'but', 'nor', 'with', 'as'
]);

function extractWords(phrase) {
  return phrase
    .split(/[\s-]+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean);
}

function generateAcronym(phrase, excludeSmallWords) {
  const words = extractWords(phrase);
  const letters = words
    .filter((w) => !excludeSmallWords || !SMALL_WORDS.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase());
  const uppercase = letters.join('');
  const withPeriods = letters.length ? letters.join('.') + '.' : '';
  return { uppercase, withPeriods, wordCount: words.length };
}

function compute({ input, excludeSmallWords }) {
  const phrase = typeof input === 'string' ? input : '';
  return generateAcronym(phrase, !!excludeSmallWords);
}

export default createComputeHandler(compute);
