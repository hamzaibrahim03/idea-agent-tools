import { createComputeHandler } from '../computeHandler.js';

function compute({ items, sortBy }) {
  const list = Array.isArray(items) ? items : [];
  const rows = list
    .map((it) => {
      const cost = Number(it.cost);
      const price = Number(it.price);
      const sold = Number(it.sold);
      const valid = Number.isFinite(cost) && cost >= 0 && Number.isFinite(price) && price > 0 && Number.isFinite(sold) && sold >= 0;
      if (!valid) return { ...it, valid: false };
      const profitPerItem = price - cost;
      const totalProfit = profitPerItem * sold;
      const totalRevenue = price * sold;
      return { ...it, valid: true, profitPerItem, totalProfit, totalRevenue };
    })
    .sort((a, b) => {
      if (!a.valid) return 1;
      if (!b.valid) return -1;
      return b[sortBy] - a[sortBy];
    });
  const grandTotalProfit = rows.reduce((sum, r) => sum + (r.valid ? r.totalProfit : 0), 0);
  return { rows, grandTotalProfit };
}

export default createComputeHandler(compute);
