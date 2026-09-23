import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ revenue, foodCost, labor, rent, utilities, other }) {
  const revenueNum = Number(revenue);
  const expenses = {
    'Food cost': Number(foodCost),
    Labor: Number(labor),
    Rent: Number(rent),
    Utilities: Number(utilities),
    Other: Number(other)
  };
  const allValid =
    Number.isFinite(revenueNum) && revenueNum > 0 &&
    Object.values(expenses).every((v) => Number.isFinite(v) && v >= 0);
  const totalExpenses = Object.values(expenses).reduce((sum, v) => sum + v, 0);
  const netProfit = revenueNum - totalExpenses;
  const profitMargin = allValid ? (netProfit / revenueNum) * 100 : null;
  return { allValid, expenses, totalExpenses, netProfit, profitMargin, revenue: revenueNum };
}

export default createComputeHandler(compute);
