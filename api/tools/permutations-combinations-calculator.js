import { createComputeHandler } from '../_lib/computeHandler.js';

const MAX_N = 170;

function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
function permutations(n, r) {
  let result = 1;
  for (let i = 0; i < r; i++) result *= n - i;
  return result;
}
function combinations(n, r) {
  const rSmall = Math.min(r, n - r);
  let result = 1;
  for (let i = 0; i < rSmall; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

function compute({ n, r }) {
  const numN = Number(n);
  const numR = Number(r);
  let error = '';
  if (n === '' || r === '') {
    error = 'Enter values for n and r.';
  } else if (!Number.isInteger(numN) || !Number.isInteger(numR)) {
    error = 'n and r must be whole numbers.';
  } else if (numN < 0 || numR < 0) {
    error = 'n and r must be non-negative.';
  } else if (numR > numN) {
    error = 'r cannot be greater than n.';
  } else if (numN > MAX_N) {
    error = `n is capped at ${MAX_N} to avoid exceeding floating-point precision.`;
  }
  let nPr = null;
  let nCr = null;
  let factorialN = null;
  if (!error) {
    nPr = permutations(numN, numR);
    nCr = combinations(numN, numR);
    if (numN <= 12) factorialN = factorial(numN);
  }
  return { error, nPr, nCr, factorialN };
}

export default createComputeHandler(compute);
