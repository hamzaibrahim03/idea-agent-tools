import { createComputeHandler } from '../_lib/computeHandler.js';

function parseNumbers(text) {
  return String(text || '')
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

function compute({ input }) {
  const numbers = parseNumbers(input);
  const valid = numbers.length > 0;
  if (!valid) {
    return { valid: false };
  }
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / numbers.length;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  return { valid: true, count: numbers.length, sum, mean, median, min, max };
}

export default createComputeHandler(compute);
