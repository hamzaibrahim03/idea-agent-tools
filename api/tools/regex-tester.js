import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ pattern, flags, testString }) {
  const flagList = Array.isArray(flags) ? flags : [];
  if (!pattern) return { matches: [], highlighted: null };
  let re;
  try {
    re = new RegExp(pattern, flagList.join(''));
  } catch (e) {
    return { regexError: e.message, matches: [], highlighted: null };
  }
  if (!testString) return { matches: [], highlighted: null };
  const scanFlags = flagList.includes('g') ? flagList.join('') : `${flagList.join('')}g`;
  let scanRe;
  try {
    scanRe = new RegExp(pattern, scanFlags);
  } catch (e) {
    return { regexError: e.message, matches: [], highlighted: null };
  }
  const found = [...testString.matchAll(scanRe)];
  const segments = [];
  let lastIndex = 0;
  for (const m of found) {
    if (m.index > lastIndex) segments.push({ text: testString.slice(lastIndex, m.index), match: false });
    segments.push({ text: m[0], match: true });
    lastIndex = m.index + m[0].length;
    if (m[0].length === 0) lastIndex++;
  }
  if (lastIndex < testString.length) segments.push({ text: testString.slice(lastIndex), match: false });
  const matches = found.map((m) => ({ full: m[0], groups: m.slice(1) }));
  return { matches, highlighted: segments };
}

export default createComputeHandler(compute);
