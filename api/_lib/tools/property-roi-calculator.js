import { createComputeHandler } from '../computeHandler.js';

function compute({ purchasePrice, totalInvestment, annualRent, annualExpenses, salePrice, holdingYears }) {
  const purchaseNum = Number(purchasePrice);
  const investmentNum = Number(totalInvestment);
  const rentNum = Number(annualRent);
  const expensesNum = Number(annualExpenses);
  const saleNum = Number(salePrice);
  const yearsNum = Number(holdingYears);
  const valid =
    Number.isFinite(purchaseNum) && purchaseNum > 0 &&
    Number.isFinite(investmentNum) && investmentNum > 0 &&
    Number.isFinite(rentNum) && rentNum >= 0 &&
    Number.isFinite(expensesNum) && expensesNum >= 0 &&
    Number.isFinite(saleNum) && saleNum >= 0 &&
    Number.isFinite(yearsNum) && yearsNum > 0;
  const annualCashFlow = valid ? rentNum - expensesNum : 0;
  const cashOnCashReturn = valid ? (annualCashFlow / investmentNum) * 100 : 0;
  const totalCashFlow = valid ? annualCashFlow * yearsNum : 0;
  const capitalGain = valid ? saleNum - purchaseNum : 0;
  const totalProfit = valid ? totalCashFlow + capitalGain : 0;
  const totalRoi = valid ? (totalProfit / investmentNum) * 100 : 0;
  const annualizedRoi = valid && yearsNum > 0 ? totalRoi / yearsNum : 0;
  return { valid, annualCashFlow, cashOnCashReturn, totalCashFlow, capitalGain, totalProfit, totalRoi, annualizedRoi };
}

export default createComputeHandler(compute);
