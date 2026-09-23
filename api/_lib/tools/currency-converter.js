import { createComputeHandler } from '../computeHandler.js';

function compute({ amount, rate }) {
  const amountNum = Number(amount);
  const rateNum = Number(rate);
  const valid = Number.isFinite(amountNum) && amountNum >= 0 && Number.isFinite(rateNum) && rateNum > 0;
  if (!valid) return { valid: false };
  const converted = amountNum * rateNum;
  return { valid: true, converted };
}

export default createComputeHandler(compute);
