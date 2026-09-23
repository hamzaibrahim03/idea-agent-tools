import { createComputeHandler } from '../_lib/computeHandler.js';

function computeTax(income, brackets) {
  const sorted = [...brackets].sort((a, b) => a.threshold - b.threshold);
  let tax = 0;
  for (let i = 0; i < sorted.length; i++) {
    const lower = sorted[i].threshold;
    const upper = i + 1 < sorted.length ? sorted[i + 1].threshold : Infinity;
    if (income <= lower) break;
    const taxableInBracket = Math.min(income, upper) - lower;
    tax += taxableInBracket * (sorted[i].rate / 100);
  }
  return tax;
}

function compute({ income, brackets }) {
  const incomeNum = Number(income);
  const parsedBrackets = (Array.isArray(brackets) ? brackets : []).map((b) => ({
    threshold: Number(b.threshold),
    rate: Number(b.rate)
  }));
  const bracketsValid = parsedBrackets.every(
    (b) => Number.isFinite(b.threshold) && b.threshold >= 0 && Number.isFinite(b.rate) && b.rate >= 0
  );
  const valid = Number.isFinite(incomeNum) && incomeNum >= 0 && bracketsValid && parsedBrackets.length > 0;
  if (!valid) {
    return { valid: false };
  }
  const totalTax = computeTax(incomeNum, parsedBrackets);
  const effectiveRate = incomeNum > 0 ? (totalTax / incomeNum) * 100 : 0;
  const afterTax = incomeNum - totalTax;
  return { valid: true, totalTax, effectiveRate, afterTax };
}

export default createComputeHandler(compute);
