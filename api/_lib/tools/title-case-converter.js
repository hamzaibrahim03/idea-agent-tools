import { createComputeHandler } from '../computeHandler.js';

const AP_MAX_MINOR_LENGTH = 3;
const AP_ALWAYS_CAPITALIZE = new Set(['is', 'are', 'be', 'if']);
const CHICAGO_MINOR_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet',
  'as', 'at', 'by', 'in', 'of', 'on', 'per', 'to', 'up', 'via', 'from', 'into', 'onto', 'with'
]);

function capitalizeWord(word) {
  const lower = word.toLowerCase();
  const firstLetterIdx = lower.search(/[a-z0-9]/);
  if (firstLetterIdx === -1) return word;
  return lower.slice(0, firstLetterIdx) + lower[firstLetterIdx].toUpperCase() + lower.slice(firstLetterIdx + 1);
}

function isMinorWord(word, style) {
  const bare = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!bare) return false;
  if (style === 'chicago') {
    return CHICAGO_MINOR_WORDS.has(bare);
  }
  return bare.length <= AP_MAX_MINOR_LENGTH && !AP_ALWAYS_CAPITALIZE.has(bare);
}

function toTitleCase(text, style) {
  return text
    .split('\n')
    .map((line) => {
      const words = line.split(/(\s+)/);
      const wordIndices = words.map((w, i) => (w.trim() ? i : -1)).filter((i) => i !== -1);
      const lastWordIdx = wordIndices[wordIndices.length - 1];
      const firstWordIdx = wordIndices[0];
      return words
        .map((word, i) => {
          if (!word.trim()) return word;
          const isEdge = i === firstWordIdx || i === lastWordIdx;
          if (!isEdge && isMinorWord(word, style)) {
            return word.toLowerCase();
          }
          return capitalizeWord(word);
        })
        .join('');
    })
    .join('\n');
}

function compute({ input, style }) {
  const output = toTitleCase(String(input || ''), style);
  return { output };
}

export default createComputeHandler(compute);
