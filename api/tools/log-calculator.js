import { createComputeHandler } from '../_lib/computeHandler.js';

function logBase(value, base) {
  return Math.log(value) / Math.log(base);
}

function compute({ value, base }) {
  const valueNum = Number(value);
  const baseNum = Number(base);
  const valid =
    Number.isFinite(valueNum) && valueNum > 0 &&
    Number.isFinite(baseNum) && baseNum > 0 && baseNum !== 1;
  if (!valid) {
    throw new Error('Value must be positive, and base must be positive and not equal to 1.');
  }
  const result = logBase(valueNum, baseNum);
  const naturalLog = Math.log(valueNum);
  const log10 = Math.log10(valueNum);
  const log2 = Math.log2(valueNum);
  return { result, naturalLog, log10, log2 };
}

export default createComputeHandler(compute);
