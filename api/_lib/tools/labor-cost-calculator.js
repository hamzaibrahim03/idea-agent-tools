import { createComputeHandler } from '../computeHandler.js';

function compute({ rows }) {
  const list = Array.isArray(rows) ? rows : [];
  const computed = list.map((r) => {
    const rate = Number(r.rate);
    const days = Number(r.days);
    const workers = Number(r.workers);
    const validRow = Number.isFinite(rate) && rate >= 0 && Number.isFinite(days) && days >= 0 && Number.isFinite(workers) && workers >= 0;
    const cost = validRow ? rate * days * workers : 0;
    return { ...r, cost, validRow };
  });
  const grandTotal = computed.reduce((sum, r) => sum + r.cost, 0);
  return { computed, grandTotal };
}

export default createComputeHandler(compute);
