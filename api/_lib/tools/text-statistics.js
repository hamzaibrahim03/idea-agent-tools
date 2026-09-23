import { createComputeHandler } from '../computeHandler.js';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function analyzeLetters(text) {
  const counts = new Map();
  let vowels = 0;
  let consonants = 0;
  for (const ch of text.toLowerCase()) {
    if (!/[a-z]/.test(ch)) continue;
    counts.set(ch, (counts.get(ch) || 0) + 1);
    if (VOWELS.has(ch)) vowels++;
    else consonants++;
  }
  const frequency = [...counts.entries()]
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));
  return {
    frequency,
    mostCommon: frequency[0] || null,
    vowels,
    consonants,
    uniqueCount: counts.size
  };
}

function compute({ input }) {
  return analyzeLetters(String(input || ''));
}

export default createComputeHandler(compute);
