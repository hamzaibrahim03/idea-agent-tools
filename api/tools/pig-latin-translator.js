import { createComputeHandler } from '../_lib/computeHandler.js';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function translateWord(word) {
  const leading = word.match(/^[a-zA-Z]+/);
  if (!leading) return word;
  const core = leading[0];
  const rest = word.slice(core.length);
  const firstChar = core[0];
  const isUpperFirst = firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
  const lower = core.toLowerCase();
  if (VOWELS.has(lower[0])) {
    const translated = lower + 'way';
    return (isUpperFirst ? capitalize(translated) : translated) + rest;
  }
  let splitIndex = 0;
  while (splitIndex < lower.length && !VOWELS.has(lower[splitIndex])) {
    if (lower[splitIndex] === 'q' && lower[splitIndex + 1] === 'u') {
      splitIndex += 2;
      continue;
    }
    splitIndex++;
  }
  if (splitIndex === 0 || splitIndex >= lower.length) {
    const translated = lower + 'ay';
    return (isUpperFirst ? capitalize(translated) : translated) + rest;
  }
  const translated = lower.slice(splitIndex) + lower.slice(0, splitIndex) + 'ay';
  return (isUpperFirst ? capitalize(translated) : translated) + rest;
}

function translateText(text) {
  return text.replace(/[a-zA-Z]+/g, translateWord);
}

function compute({ input }) {
  return { output: translateText(input || '') };
}

export default createComputeHandler(compute);
