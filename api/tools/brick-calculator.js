import { createComputeHandler } from '../_lib/computeHandler.js';

function bricksNeeded(wallAreaSqFt, brickLengthIn, brickHeightIn, jointIn, wastePercent) {
  const effLength = (brickLengthIn + jointIn) / 12;
  const effHeight = (brickHeightIn + jointIn) / 12;
  const bricksPerSqFt = 1 / (effLength * effHeight);
  const rawCount = wallAreaSqFt * bricksPerSqFt;
  const withWaste = rawCount * (1 + wastePercent / 100);
  return { bricksPerSqFt, rawCount, withWaste };
}

function compute({ wallLength, wallHeight, openingsArea, brickLength, brickHeight, joint, waste }) {
  const lengthNum = Number(wallLength);
  const heightNum = Number(wallHeight);
  const openingsNum = Number(openingsArea);
  const brickLengthNum = Number(brickLength);
  const brickHeightNum = Number(brickHeight);
  const jointNum = Number(joint);
  const wasteNum = Number(waste);
  const valid =
    Number.isFinite(lengthNum) && lengthNum > 0 &&
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(openingsNum) && openingsNum >= 0 &&
    Number.isFinite(brickLengthNum) && brickLengthNum > 0 &&
    Number.isFinite(brickHeightNum) && brickHeightNum > 0 &&
    Number.isFinite(jointNum) && jointNum >= 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  const wallArea = valid ? Math.max(0, lengthNum * heightNum - openingsNum) : 0;
  const result = valid && wallArea > 0
    ? bricksNeeded(wallArea, brickLengthNum, brickHeightNum, jointNum, wasteNum)
    : null;
  return { valid, wallArea, result };
}

export default createComputeHandler(compute);
