import { createComputeHandler } from '../computeHandler.js';

function pitchMultiplier(riseIn12) {
  return Math.sqrt(1 + (riseIn12 / 12) ** 2);
}
const BUNDLES_PER_SQUARE = 3;

function compute({ footprintLength, footprintWidth, pitch, waste }) {
  const lengthNum = Number(footprintLength);
  const widthNum = Number(footprintWidth);
  const pitchNum = Number(pitch);
  const wasteNum = Number(waste);
  const valid =
    Number.isFinite(lengthNum) && lengthNum > 0 &&
    Number.isFinite(widthNum) && widthNum > 0 &&
    Number.isFinite(pitchNum) && pitchNum >= 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  const footprintArea = valid ? lengthNum * widthNum : 0;
  const multiplier = valid ? pitchMultiplier(pitchNum) : 1;
  const roofArea = footprintArea * multiplier;
  const roofAreaWithWaste = roofArea * (1 + wasteNum / 100);
  const squares = roofAreaWithWaste / 100;
  const bundles = Math.ceil(squares * BUNDLES_PER_SQUARE);
  return { valid, footprintArea, multiplier, roofArea, roofAreaWithWaste, squares, bundles, pitchNum, wasteNum };
}

export default createComputeHandler(compute);
