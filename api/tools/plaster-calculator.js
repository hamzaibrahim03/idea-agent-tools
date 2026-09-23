import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ wallLength, wallHeight, openingsArea, thicknessMm, coverageSqFtPerBag, waste }) {
  const lengthNum = Number(wallLength);
  const heightNum = Number(wallHeight);
  const openingsNum = Number(openingsArea);
  const thicknessNum = Number(thicknessMm);
  const coverageNum = Number(coverageSqFtPerBag);
  const wasteNum = Number(waste);
  const valid =
    Number.isFinite(lengthNum) && lengthNum > 0 &&
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(openingsNum) && openingsNum >= 0 &&
    Number.isFinite(thicknessNum) && thicknessNum > 0 &&
    Number.isFinite(coverageNum) && coverageNum > 0 &&
    Number.isFinite(wasteNum) && wasteNum >= 0;
  const grossArea = valid ? lengthNum * heightNum : 0;
  const netArea = valid ? Math.max(0, grossArea - openingsNum) : 0;
  const netAreaSqM = netArea * 0.092903;
  const volumeCuM = netAreaSqM * (thicknessNum / 1000);
  const volumeCuFt = volumeCuM / 0.0283168;
  const areaWithWaste = netArea * (1 + wasteNum / 100);
  const bagsNeeded = valid && netArea > 0 ? Math.ceil(areaWithWaste / coverageNum) : null;
  return { valid, netArea, volumeCuFt, volumeCuM, bagsNeeded };
}

export default createComputeHandler(compute);
