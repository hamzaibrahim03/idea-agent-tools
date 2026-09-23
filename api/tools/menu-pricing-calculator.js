import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ ingredientCost, targetFoodCostPercent }) {
  const costNum = Number(ingredientCost);
  const percentNum = Number(targetFoodCostPercent);
  const valid = Number.isFinite(costNum) && costNum > 0 && Number.isFinite(percentNum) && percentNum > 0 && percentNum <= 100;
  if (!valid) {
    throw new Error('Enter a positive ingredient cost and a target food cost % between 0 and 100.');
  }
  const recommendedPrice = costNum / (percentNum / 100);
  return { recommendedPrice };
}

export default createComputeHandler(compute);
