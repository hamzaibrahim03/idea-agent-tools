import { createComputeHandler } from '../computeHandler.js';

function cleanText(text) {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((para) =>
      para
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(' ')
        .replace(/[ \t]+/g, ' ')
        .trim()
    )
    .filter((para) => para.length > 0);
  return paragraphs.join('\n\n');
}

function compute({ input }) {
  return { output: input ? cleanText(input) : '' };
}

export default createComputeHandler(compute);
