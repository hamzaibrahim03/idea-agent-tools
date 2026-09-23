import { createComputeHandler } from '../computeHandler.js';

function compute({ price, annualRent, annualExpenses }) {
  const priceNum = Number(price);
  const rentNum = Number(annualRent);
  const expensesNum = Number(annualExpenses);
  const valid = Number.isFinite(priceNum) && priceNum > 0 && Number.isFinite(rentNum) && rentNum >= 0 && Number.isFinite(expensesNum) && expensesNum >= 0;
  const grossYield = valid ? (rentNum / priceNum) * 100 : 0;
  const netYield = valid ? ((rentNum - expensesNum) / priceNum) * 100 : 0;
  return { valid, grossYield, netYield };
}

export default createComputeHandler(compute);
