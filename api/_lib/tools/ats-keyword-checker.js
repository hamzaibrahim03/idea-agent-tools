import { createComputeHandler } from '../computeHandler.js';

const STOPWORDS = new Set(
  ('a an the and or but if of to in on for with at by from as is are was were be been being ' +
    'this that these those it its your you we our their they i he she will shall can could ' +
    'should would may might must have has had do does did not no yes into about over under ' +
    'per etc via all any each other than then so such also more most less least than')
    .split(' ')
);
function extractWords(text) {
  return (text.toLowerCase().match(/[a-z][a-z0-9+.#-]{1,}/g) || []).filter((w) => !STOPWORDS.has(w) && w.length > 2);
}
function wordFrequency(words) {
  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  return freq;
}

function compute({ resume, jobDescription, topN }) {
  const jdWords = extractWords(jobDescription || '');
  const resumeWordSet = new Set(extractWords(resume || ''));
  if (jdWords.length === 0) {
    return { analysis: null };
  }
  const freq = wordFrequency(jdWords);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const n = Math.max(1, Number(topN) || 25);
  const topKeywords = ranked.slice(0, n);
  const matched = topKeywords.filter(([w]) => resumeWordSet.has(w));
  const missing = topKeywords.filter(([w]) => !resumeWordSet.has(w));
  const matchRate = topKeywords.length ? (matched.length / topKeywords.length) * 100 : 0;
  return { analysis: { topKeywords, matched, missing, matchRate } };
}

export default createComputeHandler(compute);
