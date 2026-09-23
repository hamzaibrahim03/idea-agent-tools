import { createComputeHandler } from '../computeHandler.js';

const PLATFORMS = [
  { key: 'twitter', label: 'Twitter / X post', limit: 280 },
  { key: 'metaTitle', label: 'Meta title (SEO)', limit: 60 },
  { key: 'metaDescription', label: 'Meta description (SEO)', limit: 160 }
];

function smsSegments(length) {
  if (length === 0) return 0;
  if (length <= 160) return 1;
  return Math.ceil(length / 153);
}

function analyze(text) {
  const length = text.length;
  const platforms = PLATFORMS.map((p) => ({
    ...p,
    remaining: p.limit - length,
    over: length > p.limit
  }));
  const segments = smsSegments(length);
  return { length, platforms, segments };
}

function compute({ input }) {
  const text = input || '';
  return analyze(text);
}

export default createComputeHandler(compute);
