import { createComputeHandler } from '../computeHandler.js';

function compute({ items }) {
  const list = Array.isArray(items) ? items : [];
  const rows = list.map((it) => {
    const weight = Number(it.weight);
    const rate = Number(it.rate);
    const validRow = Number.isFinite(weight) && weight >= 0 && Number.isFinite(rate) && rate >= 0;
    const lineTotal = validRow ? weight * rate : 0;
    return { ...it, weight, rate, validRow, lineTotal };
  });
  const total = rows.reduce((sum, r) => sum + r.lineTotal, 0);
  return { rows, total };
}

export default createComputeHandler(compute);
