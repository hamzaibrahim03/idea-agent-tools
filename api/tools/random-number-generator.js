import { createComputeHandler } from '../_lib/computeHandler.js';
import { webcrypto } from 'node:crypto';

function randomInt(min, max) {
  const range = max - min + 1;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);
  let x;
  do {
    x = webcrypto.getRandomValues(new Uint32Array(1))[0];
  } while (x >= limit);
  return min + (x % range);
}

function compute({ min, max, count, allowDuplicates }) {
  const lo = Math.min(Number(min), Number(max));
  const hi = Math.max(Number(min), Number(max));
  const n = Math.max(1, Math.min(1000, Number(count) || 1));
  if (!allowDuplicates && hi - lo + 1 < n) {
    throw new Error('Range too small for that many unique numbers.');
  }
  let results;
  if (allowDuplicates) {
    results = Array.from({ length: n }, () => randomInt(lo, hi));
  } else {
    const pool = [];
    const seen = new Set();
    while (pool.length < n) {
      const v = randomInt(lo, hi);
      if (!seen.has(v)) {
        seen.add(v);
        pool.push(v);
      }
    }
    results = pool;
  }
  return { results };
}

export default createComputeHandler(compute);
