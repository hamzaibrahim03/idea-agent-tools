import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ yieldPerAcre, pricePerUnit, totalAcres, costs }) {
  const yieldNum = Number(yieldPerAcre);
  const priceNum = Number(pricePerUnit);
  const acresNum = Number(totalAcres);
  const valid =
    Number.isFinite(yieldNum) && yieldNum > 0 &&
    Number.isFinite(priceNum) && priceNum >= 0 &&
    Number.isFinite(acresNum) && acresNum > 0;
  const totalCost = (costs || []).reduce((sum, c) => {
    const a = Number(c.amount);
    return sum + (Number.isFinite(a) && a >= 0 ? a : 0);
  }, 0);
  if (!valid) {
    return { valid: false, totalCost };
  }
  const totalYield = yieldNum * acresNum;
  const totalRevenue = totalYield * priceNum;
  const netProfit = totalRevenue - totalCost;
  return { valid: true, totalYield, totalRevenue, totalCost, netProfit };
}

export default createComputeHandler(compute);
