import { createComputeHandler } from '../computeHandler.js';

function compute({ area, areaUnit, targetRate, productPercent }) {
  const areaNum = Number(area);
  const rateNum = Number(targetRate);
  const percentNum = Number(productPercent);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(rateNum) && rateNum > 0 &&
    Number.isFinite(percentNum) && percentNum > 0 && percentNum <= 100;
  if (!valid) {
    throw new Error('Enter a positive field area, positive target rate, and a product nutrient percentage between 1 and 100.');
  }
  const productPerArea = rateNum / (percentNum / 100);
  const totalProduct = productPerArea * areaNum;
  return { valid, areaUnit, productPerArea, totalProduct };
}

export default createComputeHandler(compute);
