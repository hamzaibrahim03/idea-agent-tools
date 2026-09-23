import { createComputeHandler } from '../_lib/computeHandler.js';

function formatNum(n) {
  return Number(n.toFixed(6)).toString();
}

function compute({ mode, base, height, sideA, sideB, sideC }) {
  let result = null;
  let error = '';
  if (mode === 'base-height') {
    const b = Number(base);
    const h = Number(height);
    if (base === '' || height === '' || Number.isNaN(b) || Number.isNaN(h) || b <= 0 || h <= 0) {
      error = 'Enter positive numbers for base and height.';
    } else {
      result = 0.5 * b * h;
    }
  } else {
    const x = Number(sideA);
    const y = Number(sideB);
    const z = Number(sideC);
    if (
      sideA === '' || sideB === '' || sideC === '' ||
      [x, y, z].some((n) => Number.isNaN(n) || n <= 0)
    ) {
      error = 'Enter positive numbers for all three sides.';
    } else if (x + y <= z || x + z <= y || y + z <= x) {
      error = 'These side lengths do not form a valid triangle (triangle inequality violated).';
    } else {
      const s = (x + y + z) / 2;
      result = Math.sqrt(s * (s - x) * (s - y) * (s - z));
    }
  }
  return { result: result !== null ? formatNum(result) : null, error };
}

export default createComputeHandler(compute);
