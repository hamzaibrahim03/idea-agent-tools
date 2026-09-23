import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ fixedCosts, variableCost, price }) {
  const fixedNum = Number(fixedCosts);
  const variableNum = Number(variableCost);
  const priceNum = Number(price);
  const contributionMargin = priceNum - variableNum;
  const valid =
    Number.isFinite(fixedNum) && fixedNum >= 0 &&
    Number.isFinite(variableNum) && variableNum >= 0 &&
    Number.isFinite(priceNum) && priceNum > 0 &&
    contributionMargin > 0;
  const breakEvenUnits = valid ? fixedNum / contributionMargin : 0;
  const breakEvenRevenue = valid ? breakEvenUnits * priceNum : 0;
  const contributionMarginRatio = valid ? (contributionMargin / priceNum) * 100 : 0;
  return { valid, contributionMargin, breakEvenUnits, breakEvenRevenue, contributionMarginRatio };
}

export default createComputeHandler(compute);
