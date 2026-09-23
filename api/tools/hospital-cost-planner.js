import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ items, coveragePercent }) {
  const list = items || [];
  const coverageNum = Number(coveragePercent);
  const coverageValid = Number.isFinite(coverageNum) && coverageNum >= 0 && coverageNum <= 100;
  const totalCost = list.reduce((sum, it) => {
    const c = Number(it.cost);
    return sum + (Number.isFinite(c) && c > 0 ? c : 0);
  }, 0);
  const insurancePays = coverageValid ? totalCost * (coverageNum / 100) : 0;
  const outOfPocket = totalCost - insurancePays;
  return { coverageValid, totalCost, insurancePays, outOfPocket };
}

export default createComputeHandler(compute);
