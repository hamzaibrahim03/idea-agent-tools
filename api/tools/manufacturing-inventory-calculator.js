import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ currentStock, dailyUsage, leadTime, safetyStock }) {
  const stockNum = Number(currentStock);
  const usageNum = Number(dailyUsage);
  const leadTimeNum = Number(leadTime);
  const safetyNum = Number(safetyStock);
  const valid =
    Number.isFinite(stockNum) && stockNum >= 0 &&
    Number.isFinite(usageNum) && usageNum > 0 &&
    Number.isFinite(leadTimeNum) && leadTimeNum >= 0 &&
    Number.isFinite(safetyNum) && safetyNum >= 0;
  if (!valid) {
    throw new Error('Enter a non-negative current stock, a positive daily usage rate, and non-negative lead time and safety stock.');
  }
  const daysRemaining = stockNum / usageNum;
  const reorderPoint = usageNum * leadTimeNum + safetyNum;
  const belowReorderPoint = stockNum <= reorderPoint;
  return { valid, daysRemaining, reorderPoint, belowReorderPoint };
}

export default createComputeHandler(compute);
