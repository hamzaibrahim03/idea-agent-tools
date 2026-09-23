import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ totalPrice, totalSqft, targetPricePerSqft, knownSqft }) {
  const priceNum = Number(totalPrice);
  const sqftNum = Number(totalSqft);
  const fromPriceValid = Number.isFinite(priceNum) && priceNum >= 0 && Number.isFinite(sqftNum) && sqftNum > 0;
  const pricePerSqft = fromPriceValid ? priceNum / sqftNum : null;
  const targetNum = Number(targetPricePerSqft);
  const knownSqftNum = Number(knownSqft);
  const fromTargetValid = Number.isFinite(targetNum) && targetNum >= 0 && Number.isFinite(knownSqftNum) && knownSqftNum > 0;
  const totalFromTarget = fromTargetValid ? targetNum * knownSqftNum : null;
  return { fromPriceValid, pricePerSqft, fromTargetValid, totalFromTarget };
}

export default createComputeHandler(compute);
