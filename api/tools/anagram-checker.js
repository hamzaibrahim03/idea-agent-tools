import { createComputeHandler } from '../_lib/computeHandler.js';

function clean(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function sortedLetters(text) {
  return [...text].sort().join('');
}

function compute({ inputA, inputB }) {
  const a = typeof inputA === 'string' ? inputA : '';
  const b = typeof inputB === 'string' ? inputB : '';
  const cleanedA = clean(a);
  const cleanedB = clean(b);
  const sortedA = sortedLetters(cleanedA);
  const sortedB = sortedLetters(cleanedB);
  const ready = cleanedA.length > 0 && cleanedB.length > 0;
  const isAnagram = ready && sortedA === sortedB;
  return { cleanedA, cleanedB, sortedA, sortedB, ready, isAnagram };
}

export default createComputeHandler(compute);
