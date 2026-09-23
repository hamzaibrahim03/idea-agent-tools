import { createComputeHandler } from '../computeHandler.js';

function compute({ area, seedingRate }) {
  const areaNum = Number(area);
  const rateNum = Number(seedingRate);
  const valid = Number.isFinite(areaNum) && areaNum > 0 && Number.isFinite(rateNum) && rateNum > 0;
  const totalSeed = valid ? areaNum * rateNum : null;
  return { valid, totalSeed };
}

export default createComputeHandler(compute);
