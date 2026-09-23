import { createComputeHandler } from '../_lib/computeHandler.js';

function lcsLength(a, b) {
  const m = a.length, n = b.length;
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function similarity(a, b) {
  if (a.length === 0 && b.length === 0) return 100;
  const lcs = lcsLength(a, b);
  return (2 * lcs / (a.length + b.length)) * 100;
}

function compute({ left, right }) {
  const l = String(left || '');
  const r = String(right || '');
  const percent = similarity(l, r);
  return { percent, hasInput: l.length > 0 || r.length > 0 };
}

export default createComputeHandler(compute);
