import { createComputeHandler } from '../_lib/computeHandler.js';

const BAG_YIELDS_CU_FT = {
  40: 0.3,
  60: 0.45,
  80: 0.6
};

function slabVolumeCuFt(lengthFt, widthFt, thicknessIn) {
  return lengthFt * widthFt * (thicknessIn / 12);
}

function compute({ shape, length, width, thickness, diameter, depth, waste, bagSize }) {
  const lengthNum = Number(length);
  const widthNum = Number(width);
  const thicknessNum = Number(thickness);
  const diameterNum = Number(diameter);
  const depthNum = Number(depth);
  const wasteNum = Number(waste);

  let volumeCuFt = null;
  let valid = false;
  if (shape === 'slab') {
    valid =
      Number.isFinite(lengthNum) && lengthNum > 0 &&
      Number.isFinite(widthNum) && widthNum > 0 &&
      Number.isFinite(thicknessNum) && thicknessNum > 0;
    if (valid) volumeCuFt = slabVolumeCuFt(lengthNum, widthNum, thicknessNum);
  } else {
    valid =
      Number.isFinite(diameterNum) && diameterNum > 0 &&
      Number.isFinite(depthNum) && depthNum > 0;
    if (valid) {
      const radiusFt = diameterNum / 12 / 2;
      volumeCuFt = Math.PI * radiusFt * radiusFt * (depthNum / 12);
    }
  }
  const wasteValid = Number.isFinite(wasteNum) && wasteNum >= 0;
  if (!valid || !wasteValid) {
    throw new Error('Enter positive dimensions and a non-negative waste percentage.');
  }
  const volumeWithWaste = volumeCuFt * (1 + wasteNum / 100);
  const volumeCuYd = volumeWithWaste / 27;
  const bagsNeeded = Math.ceil(volumeWithWaste / BAG_YIELDS_CU_FT[bagSize]);

  return {
    volumeCuFt,
    volumeWithWaste,
    volumeCuYd,
    bagsNeeded,
    bagSize
  };
}

export default createComputeHandler(compute);
