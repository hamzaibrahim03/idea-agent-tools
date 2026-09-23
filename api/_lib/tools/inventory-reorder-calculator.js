import { createComputeHandler } from '../computeHandler.js';

function calculate({ avgDailySales, leadTimeDays, safetyStockDays }) {
  const leadTimeDemand = avgDailySales * leadTimeDays;
  const safetyStock = avgDailySales * safetyStockDays;
  const reorderPoint = leadTimeDemand + safetyStock;
  return { leadTimeDemand, safetyStock, reorderPoint };
}

function compute({ avgDailySales, leadTimeDays, safetyStockDays }) {
  const avgNum = parseFloat(avgDailySales) || 0;
  const leadNum = parseFloat(leadTimeDays) || 0;
  const safetyNum = parseFloat(safetyStockDays) || 0;
  const result = calculate({ avgDailySales: avgNum, leadTimeDays: leadNum, safetyStockDays: safetyNum });
  return result;
}

export default createComputeHandler(compute);
