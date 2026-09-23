import { createComputeHandler } from '../_lib/computeHandler.js';

function removeDuplicates(text, options) {
  const lines = String(text || '').split('\n');
  const seen = new Set();
  const output = [];
  let removed = 0;
  for (const line of lines) {
    let key = options.trim ? line.trim() : line;
    if (options.caseInsensitive) key = key.toLowerCase();
    if (seen.has(key)) {
      removed++;
      continue;
    }
    seen.add(key);
    output.push(line);
  }
  return { lines: output, removed };
}

function compute({ input = '', caseInsensitive = false, trim = false }) {
  const { lines, removed } = removeDuplicates(input, { caseInsensitive, trim });
  return { lines, removed, output: lines.join('\n') };
}

export default createComputeHandler(compute);
