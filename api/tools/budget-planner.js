import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ income, categories }) {
  const incomeNum = Number(income);
  const valid = Number.isFinite(incomeNum) && incomeNum > 0;
  const list = Array.isArray(categories) ? categories : [];
  const rows = list.map((c) => {
    const amt = Number(c.amount) || 0;
    const targetPct = Number(c.targetPercent) || 0;
    const actualPct = valid ? (amt / incomeNum) * 100 : 0;
    const targetAmount = valid ? (incomeNum * targetPct) / 100 : 0;
    return { ...c, amt, targetPct, actualPct, targetAmount };
  });
  const totalAllocated = rows.reduce((sum, r) => sum + r.amt, 0);
  const totalTargetPercent = rows.reduce((sum, r) => sum + r.targetPct, 0);
  const remaining = valid ? incomeNum - totalAllocated : 0;
  return { valid, rows, totalAllocated, totalTargetPercent, remaining };
}

export default createComputeHandler(compute);
