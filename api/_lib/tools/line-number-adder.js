import { createComputeHandler } from '../computeHandler.js';

function addLineNumbers(text, start, padWidth, separator) {
  if (!text) return '';
  const lines = text.split('\n');
  const maxNumber = start + lines.length - 1;
  const width = Math.max(padWidth, String(maxNumber).length);
  return lines
    .map((line, idx) => `${String(start + idx).padStart(width, '0')}${separator}${line}`)
    .join('\n');
}

function compute({ input, start, padWidth, separator }) {
  const output = addLineNumbers(
    input || '',
    Math.max(0, Number(start) || 0),
    Math.max(1, Number(padWidth) || 1),
    separator
  );
  return { output };
}

export default createComputeHandler(compute);
