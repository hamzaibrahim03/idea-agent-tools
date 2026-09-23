import { createComputeHandler } from '../computeHandler.js';

function clean(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function compute({ input }) {
  const cleaned = clean(input || '');
  const isPalindrome = cleaned.length > 0 && cleaned === [...cleaned].reverse().join('');
  return { cleaned, isPalindrome };
}

export default createComputeHandler(compute);
