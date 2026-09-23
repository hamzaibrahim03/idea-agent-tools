import { createComputeHandler } from '../computeHandler.js';

function calculate({ spend, revenue, customers }) {
  if (spend <= 0) return null;
  const roiPercent = ((revenue - spend) / spend) * 100;
  const roas = revenue / spend;
  const cpa = customers > 0 ? spend / customers : null;
  return { roiPercent, roas, cpa };
}

function compute({ spend, revenue, customers }) {
  const spendNum = parseFloat(spend) || 0;
  const revenueNum = parseFloat(revenue) || 0;
  const customersNum = parseFloat(customers) || 0;
  const result = calculate({ spend: spendNum, revenue: revenueNum, customers: customersNum });
  return { spendValid: spendNum > 0, result };
}

export default createComputeHandler(compute);
