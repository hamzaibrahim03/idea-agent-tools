import { createComputeHandler } from '../computeHandler.js';

const MAX_N = 170;
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function compute({ n }) {
  const nNum = parseInt(n, 10);
  const valid = Number.isFinite(nNum) && Number.isInteger(Number(n)) && nNum >= 0 && nNum <= MAX_N;
  if (!valid) return { valid: false };
  const result = factorial(nNum);
  const steps = nNum > 0 ? Array.from({ length: nNum }, (_, i) => nNum - i).join(' × ') : '1 (by definition)';
  return { valid: true, result, steps };
}

export default createComputeHandler(compute);
