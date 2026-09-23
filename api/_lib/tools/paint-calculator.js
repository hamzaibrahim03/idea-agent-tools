import { createComputeHandler } from '../computeHandler.js';

function compute({ wallLength, wallHeight, openingsArea, coats, coverage }) {
  const lengthNum = Number(wallLength);
  const heightNum = Number(wallHeight);
  const openingsNum = Number(openingsArea);
  const coatsNum = Number(coats);
  const coverageNum = Number(coverage);
  const valid =
    Number.isFinite(lengthNum) && lengthNum > 0 &&
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(openingsNum) && openingsNum >= 0 &&
    Number.isFinite(coatsNum) && coatsNum > 0 &&
    Number.isFinite(coverageNum) && coverageNum > 0;
  const grossArea = valid ? lengthNum * heightNum : 0;
  const netArea = valid ? Math.max(0, grossArea - openingsNum) : 0;
  const totalAreaToPaint = valid ? netArea * coatsNum : 0;
  const gallonsNeeded = valid && netArea > 0 ? totalAreaToPaint / coverageNum : null;
  return { valid, netArea, totalAreaToPaint, gallonsNeeded };
}

export default createComputeHandler(compute);
