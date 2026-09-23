import { createComputeHandler } from '../computeHandler.js';

function compute({ groups }) {
  const list = Array.isArray(groups) ? groups : [];
  const rows = list.map((g) => {
    const count = Number(g.count);
    const perAnimal = Number(g.dailyFeedLbs);
    const validRow = Number.isFinite(count) && count >= 0 && Number.isFinite(perAnimal) && perAnimal >= 0;
    const dailyTotal = validRow ? count * perAnimal : 0;
    return { ...g, count, perAnimal, validRow, dailyTotal };
  });
  const totalDaily = rows.reduce((sum, r) => sum + r.dailyTotal, 0);
  const totalMonthly = totalDaily * 30;
  return { rows, totalDaily, totalMonthly };
}

export default createComputeHandler(compute);
