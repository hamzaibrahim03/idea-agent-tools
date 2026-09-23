import { createComputeHandler } from '../computeHandler.js';

function navyBodyFat(sex, heightCm, neckCm, waistCm, hipCm) {
  if (sex === 'male') {
    if (waistCm - neckCm <= 0) return null;
    return 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  }
  if (waistCm + hipCm - neckCm <= 0) return null;
  return 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) - 450;
}

function compute({ sex, heightCm, neckCm, waistCm, hipCm }) {
  const heightNum = Number(heightCm);
  const neckNum = Number(neckCm);
  const waistNum = Number(waistCm);
  const hipNum = Number(hipCm);
  const valid =
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(neckNum) && neckNum > 0 &&
    Number.isFinite(waistNum) && waistNum > 0 &&
    (sex === 'male' || (Number.isFinite(hipNum) && hipNum > 0));
  const bodyFat = valid ? navyBodyFat(sex, heightNum, neckNum, waistNum, hipNum) : null;
  return { valid, bodyFat };
}

export default createComputeHandler(compute);
