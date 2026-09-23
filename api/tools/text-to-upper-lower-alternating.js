import { createComputeHandler } from '../_lib/computeHandler.js';

function toAlternatingCase(text, startUpper) {
  let upperNext = startUpper;
  return [...text]
    .map((ch) => {
      if (!/[a-zA-Z]/.test(ch)) return ch;
      const result = upperNext ? ch.toUpperCase() : ch.toLowerCase();
      upperNext = !upperNext;
      return result;
    })
    .join('');
}

function compute({ input, startUpper }) {
  const output = toAlternatingCase(String(input || ''), !!startUpper);
  return { output };
}

export default createComputeHandler(compute);
