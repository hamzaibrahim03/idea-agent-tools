import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ areaAcres, waterReqIn, efficiency }) {
  const areaNum = Number(areaAcres);
  const waterReqNum = Number(waterReqIn);
  const efficiencyNum = Number(efficiency);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(waterReqNum) && waterReqNum > 0 &&
    Number.isFinite(efficiencyNum) && efficiencyNum > 0 && efficiencyNum <= 100;
  if (!valid) {
    throw new Error('Enter a positive field area, positive water requirement, and efficiency between 1 and 100%.');
  }
  const grossGallons = areaNum * waterReqNum * 27154;
  const volumeGallons = grossGallons / (efficiencyNum / 100);
  const volumeLiters = volumeGallons * 3.78541;
  return { volumeGallons, volumeLiters };
}

export default createComputeHandler(compute);
