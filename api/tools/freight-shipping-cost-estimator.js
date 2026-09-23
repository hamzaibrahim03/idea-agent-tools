import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ distance, weight, baseRate, perMile, perLb }) {
  const distanceNum = Number(distance);
  const weightNum = Number(weight);
  const baseNum = Number(baseRate);
  const perMileNum = Number(perMile);
  const perLbNum = Number(perLb);
  const valid = [distanceNum, weightNum, baseNum, perMileNum, perLbNum].every((n) => Number.isFinite(n) && n >= 0);
  const distanceCost = valid ? distanceNum * perMileNum : null;
  const weightCost = valid ? weightNum * perLbNum : null;
  const totalCost = valid ? baseNum + distanceCost + weightCost : null;
  return { valid, baseNum, distanceCost, weightCost, totalCost };
}

export default createComputeHandler(compute);
