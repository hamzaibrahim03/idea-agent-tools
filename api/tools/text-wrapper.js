import { createComputeHandler } from '../_lib/computeHandler.js';

function wrapLine(line, width) {
  if (line.length === 0) return '';
  const words = line.split(' ');
  const outputLines = [];
  let current = '';
  for (const word of words) {
    if (word.length > width) {
      if (current) {
        outputLines.push(current);
        current = '';
      }
      let remaining = word;
      while (remaining.length > width) {
        outputLines.push(remaining.slice(0, width));
        remaining = remaining.slice(width);
      }
      current = remaining;
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > width) {
      outputLines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) outputLines.push(current);
  return outputLines.join('\n');
}

function wrapText(text, width) {
  if (width < 1) return text;
  return text
    .split('\n')
    .map((line) => wrapLine(line, width))
    .join('\n');
}

function compute({ input, width }) {
  const output = wrapText(String(input || ''), Number(width) || 80);
  return { output };
}

export default createComputeHandler(compute);
