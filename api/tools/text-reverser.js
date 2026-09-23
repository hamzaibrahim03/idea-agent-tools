import { createComputeHandler } from '../_lib/computeHandler.js';

function reverseChars(text) {
  return [...text].reverse().join('');
}
function reverseWords(text) {
  return text.split(/(\s+)/).reverse().join('');
}
function reverseLines(text) {
  return text.split('\n').reverse().join('\n');
}
const MODES = {
  Characters: reverseChars,
  Words: reverseWords,
  Lines: reverseLines
};

function compute({ input, mode }) {
  const text = String(input || '');
  const fn = MODES[mode] || MODES.Characters;
  const output = text ? fn(text) : '';
  return { output };
}

export default createComputeHandler(compute);
