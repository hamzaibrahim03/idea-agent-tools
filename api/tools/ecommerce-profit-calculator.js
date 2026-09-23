import { createComputeHandler } from '../_lib/computeHandler.js';

function calculate(revenue, lineItems) {
  const totalCosts = lineItems.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const netProfit = revenue - totalCosts;
  const marginPct = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  return { totalCosts, netProfit, marginPct };
}

function compute({ revenue, lineItems }) {
  const revenueNum = parseFloat(revenue) || 0;
  const result = calculate(revenueNum, lineItems || []);
  return result;
}

export default createComputeHandler(compute);
