import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ cost, sellingPrice }) {
  const costNum = Number(cost);
  const priceNum = Number(sellingPrice);
  const valid = Number.isFinite(costNum) && costNum >= 0 && Number.isFinite(priceNum) && priceNum >= 0;
  const profitAmount = valid ? priceNum - costNum : 0;
  const grossMarginPercent = valid && priceNum > 0 ? (profitAmount / priceNum) * 100 : 0;
  const markupPercent = valid && costNum > 0 ? (profitAmount / costNum) * 100 : 0;
  return { valid, profitAmount, grossMarginPercent, markupPercent };
}

export default createComputeHandler(compute);
