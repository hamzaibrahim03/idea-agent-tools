import { createComputeHandler } from '../_lib/computeHandler.js';

function gcdTwo(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcdTwo(a, b);
}

function gcdList(nums) {
  return nums.reduce((acc, n) => gcdTwo(acc, n));
}

function lcmList(nums) {
  return nums.reduce((acc, n) => lcmTwo(acc, n));
}

function compute({ input }) {
  const parsed = (input || '')
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number);
  let error = '';
  if (parsed.length < 2) {
    error = 'Enter at least two numbers, separated by commas or spaces.';
  } else if (parsed.some((n) => !Number.isInteger(n))) {
    error = 'All values must be whole numbers.';
  } else if (parsed.every((n) => n === 0)) {
    error = 'At least one number must be non-zero.';
  }
  if (error) {
    throw new Error(error);
  }
  const result = { gcd: gcdList(parsed), lcm: lcmList(parsed) };
  return { result };
}

export default createComputeHandler(compute);
