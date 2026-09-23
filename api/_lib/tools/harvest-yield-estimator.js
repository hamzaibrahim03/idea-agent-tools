import { createComputeHandler } from '../computeHandler.js';

function compute({ area, yieldRate }) {
  const areaNum = Number(area);
  const yieldNum = Number(yieldRate);
  const valid = Number.isFinite(areaNum) && areaNum > 0 && Number.isFinite(yieldNum) && yieldNum > 0;
  if (!valid) return { valid: false };
  const totalHarvest = areaNum * yieldNum;
  return { valid: true, totalHarvest };
}

export default createComputeHandler(compute);
