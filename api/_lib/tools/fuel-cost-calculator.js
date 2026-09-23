import { createComputeHandler } from '../computeHandler.js';

function compute({ unit, distance, efficiency, price }) {
  const distanceNum = Number(distance);
  const efficiencyNum = Number(efficiency);
  const priceNum = Number(price);
  const valid =
    Number.isFinite(distanceNum) && distanceNum > 0 &&
    Number.isFinite(efficiencyNum) && efficiencyNum > 0 &&
    Number.isFinite(priceNum) && priceNum >= 0;
  if (!valid) {
    throw new Error('Enter a positive distance, a positive fuel efficiency, and a non-negative fuel price.');
  }
  let fuelUsed;
  if (unit === 'mpg') {
    fuelUsed = distanceNum / efficiencyNum;
  } else {
    fuelUsed = (distanceNum / 100) * efficiencyNum;
  }
  const totalCost = fuelUsed * priceNum;
  return { valid, fuelUsed, totalCost };
}

export default createComputeHandler(compute);
