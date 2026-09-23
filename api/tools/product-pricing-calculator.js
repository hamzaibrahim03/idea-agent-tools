import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ cost, marginPercent, shipping, platformFeePercent }) {
  const costNum = Number(cost);
  const marginNum = Number(marginPercent);
  const shippingNum = Number(shipping);
  const feeNum = Number(platformFeePercent);
  const valid =
    Number.isFinite(costNum) && costNum >= 0 &&
    Number.isFinite(marginNum) && marginNum >= 0 && marginNum < 100 &&
    Number.isFinite(shippingNum) && shippingNum >= 0 &&
    Number.isFinite(feeNum) && feeNum >= 0 && feeNum < 100;
  const baseCost = costNum + shippingNum;
  const denominator = 1 - marginNum / 100 - feeNum / 100;
  const priceValid = valid && denominator > 0;
  const recommendedPrice = priceValid ? baseCost / denominator : 0;
  const platformFeeAmount = priceValid ? recommendedPrice * (feeNum / 100) : 0;
  const profitAmount = priceValid ? recommendedPrice - baseCost - platformFeeAmount : 0;
  return { valid, priceValid, recommendedPrice, platformFeeAmount, profitAmount };
}

export default createComputeHandler(compute);
