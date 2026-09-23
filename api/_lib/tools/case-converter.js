import { createComputeHandler } from '../computeHandler.js';

function toWords(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

const CONVERTERS = {
  camelCase: (words) =>
    words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join(''),
  PascalCase: (words) => words.map((w) => w[0].toUpperCase() + w.slice(1)).join(''),
  snake_case: (words) => words.join('_'),
  'kebab-case': (words) => words.join('-'),
  CONSTANT_CASE: (words) => words.join('_').toUpperCase()
};

function compute({ input }) {
  const text = input || '';
  const words = toWords(text);
  const results = Object.entries(CONVERTERS).map(([label, fn]) => [label, words.length ? fn(words) : '']);
  return { results };
}

export default createComputeHandler(compute);
