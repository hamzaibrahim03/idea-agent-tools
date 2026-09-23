import { createComputeHandler } from '../computeHandler.js';

function compute({ totalBudget, days }) {
  const budget = parseFloat(totalBudget) || 0;
  const dayList = Array.isArray(days) ? days : [];
  const totalWeight = dayList.reduce((sum, d) => sum + (Number(d.weight) || 0), 0);
  const evenPerDay = dayList.length > 0 ? budget / dayList.length : 0;
  const weightedAmounts = dayList.map((d) => {
    const weight = Number(d.weight) || 0;
    return totalWeight > 0 ? (budget * weight) / totalWeight : 0;
  });
  return { budget, totalWeight, evenPerDay, weightedAmounts };
}

export default createComputeHandler(compute);
