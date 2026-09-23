import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ material, labor, overhead, units }) {
  const materialNum = Number(material);
  const laborNum = Number(labor);
  const overheadNum = Number(overhead);
  const unitsNum = Number(units);
  const valid =
    [materialNum, laborNum, overheadNum].every((n) => Number.isFinite(n) && n >= 0) &&
    Number.isFinite(unitsNum) && unitsNum > 0;
  const costPerUnit = valid ? materialNum + laborNum + overheadNum : null;
  const totalCost = valid ? costPerUnit * unitsNum : null;
  return { valid, costPerUnit, totalCost };
}

export default createComputeHandler(compute);
