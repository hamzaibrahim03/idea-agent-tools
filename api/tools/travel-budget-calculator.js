import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ categories, tripDays }) {
  const cats = Array.isArray(categories) ? categories : [];
  const parsed = cats.map((c) => ({ ...c, value: parseFloat(c.amount) || 0 }));
  const total = parsed.reduce((sum, c) => sum + c.value, 0);
  const days = parseFloat(tripDays);
  const perDay = days > 0 ? total / days : null;
  const breakdown = parsed
    .filter((c) => c.value > 0)
    .map((c) => ({ name: c.name, value: c.value, percent: total > 0 ? (c.value / total) * 100 : 0 }));
  return { total, perDay, days: Number.isFinite(days) ? days : null, breakdown };
}

export default createComputeHandler(compute);
