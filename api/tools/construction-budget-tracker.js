import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ budget, expenses }) {
  const budgetNum = Number(budget);
  const budgetValid = Number.isFinite(budgetNum) && budgetNum >= 0;
  if (!budgetValid) {
    throw new Error('Enter a non-negative total budget.');
  }
  const list = Array.isArray(expenses) ? expenses : [];
  const rows = list.map((e) => {
    const amt = Number(e.amount);
    const validRow = Number.isFinite(amt) && amt >= 0;
    return { ...e, amt: validRow ? amt : 0, validRow };
  });
  const totalSpent = rows.reduce((sum, r) => sum + r.amt, 0);
  const remaining = budgetNum - totalSpent;
  const percentUsed = budgetNum > 0 ? (totalSpent / budgetNum) * 100 : null;
  const byCategory = {};
  rows.forEach((r) => {
    const cat = (r.category || '').trim() || '(uncategorized)';
    byCategory[cat] = (byCategory[cat] || 0) + r.amt;
  });

  return { totalSpent, remaining, percentUsed, byCategory, budget: budgetNum };
}

export default createComputeHandler(compute);
