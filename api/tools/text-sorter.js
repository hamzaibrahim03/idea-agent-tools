import { createComputeHandler } from '../_lib/computeHandler.js';

function naturalCompare(a, b) {
  const chunk = /(\d+)|(\D+)/g;
  const aParts = a.match(chunk) || [];
  const bParts = b.match(chunk) || [];
  const len = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < len; i++) {
    const ap = aParts[i] ?? '';
    const bp = bParts[i] ?? '';
    const aNum = /^\d+$/.test(ap);
    const bNum = /^\d+$/.test(bp);
    if (aNum && bNum) {
      const diff = Number(ap) - Number(bp);
      if (diff !== 0) return diff;
    } else if (ap !== bp) {
      return ap < bp ? -1 : 1;
    }
  }
  return 0;
}

function sortLines(text, options) {
  let lines = text.split('\n');
  if (options.dedupe) {
    const seen = new Set();
    lines = lines.filter((line) => {
      const key = options.caseInsensitive ? line.toLowerCase() : line;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  const compare = (a, b) => {
    const aKey = options.caseInsensitive ? a.toLowerCase() : a;
    const bKey = options.caseInsensitive ? b.toLowerCase() : b;
    if (options.natural) return naturalCompare(aKey, bKey);
    if (aKey < bKey) return -1;
    if (aKey > bKey) return 1;
    return 0;
  };
  lines = [...lines].sort(compare);
  if (options.direction === 'desc') lines.reverse();
  return lines;
}

function compute({ input, direction, caseInsensitive, dedupe, natural }) {
  const output = sortLines(String(input || ''), { direction, caseInsensitive, dedupe, natural }).join('\n');
  return { output };
}

export default createComputeHandler(compute);
