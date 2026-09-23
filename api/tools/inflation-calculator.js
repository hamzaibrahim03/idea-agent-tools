import { createComputeHandler } from '../_lib/computeHandler.js';

function adjustForInflation(amount, startYear, endYear, annualRatePercent) {
  const years = endYear - startYear;
  const r = annualRatePercent / 100;
  const adjustedAmount = amount * (1 + r) ** years;
  return { adjustedAmount, years };
}

function compute({ amount, startYear, endYear, rate }) {
  const amountNum = Number(amount);
  const startYearNum = Number(startYear);
  const endYearNum = Number(endYear);
  const rateNum = Number(rate);
  const valid =
    Number.isFinite(amountNum) && amountNum >= 0 &&
    Number.isInteger(startYearNum) &&
    Number.isInteger(endYearNum) &&
    Number.isFinite(rateNum);
  if (!valid) return { valid: false };
  const result = adjustForInflation(amountNum, startYearNum, endYearNum, rateNum);
  return { valid: true, result };
}

export default createComputeHandler(compute);
