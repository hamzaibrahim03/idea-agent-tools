import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ revenue, cogs, expenses }) {
  const revenueNum = Number(revenue);
  const cogsNum = Number(cogs);
  const expenseAmounts = (expenses || []).map((e) => Number(e.amount) || 0);
  const totalOperatingExpenses = expenseAmounts.reduce((sum, a) => sum + a, 0);
  const valid = Number.isFinite(revenueNum) && revenueNum >= 0 && Number.isFinite(cogsNum) && cogsNum >= 0;
  const grossProfit = valid ? revenueNum - cogsNum : 0;
  const totalExpenses = cogsNum + totalOperatingExpenses;
  const netProfit = valid ? revenueNum - totalExpenses : 0;
  const netMargin = valid && revenueNum > 0 ? (netProfit / revenueNum) * 100 : 0;
  const grossMargin = valid && revenueNum > 0 ? (grossProfit / revenueNum) * 100 : 0;
  return { valid, grossProfit, totalExpenses, netProfit, netMargin, grossMargin };
}

export default createComputeHandler(compute);
