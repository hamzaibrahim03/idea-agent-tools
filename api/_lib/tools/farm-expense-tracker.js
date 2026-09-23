import { createComputeHandler } from '../computeHandler.js';

function compute({ expenses }) {
  const rows = (expenses || []).map((e) => {
    const amt = Number(e.amount);
    return { ...e, amt: Number.isFinite(amt) && amt >= 0 ? amt : 0 };
  });
  const total = rows.reduce((sum, r) => sum + r.amt, 0);
  const byCategory = {};
  rows.forEach((r) => {
    const cat = (r.category || '').trim() || '(uncategorized)';
    byCategory[cat] = (byCategory[cat] || 0) + r.amt;
  });
  return { total, byCategory };
}

export default createComputeHandler(compute);
