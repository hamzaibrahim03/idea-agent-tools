import { createComputeHandler } from '../_lib/computeHandler.js';

function maxLoanFromPayment(payment, annualRatePercent, months) {
  if (payment <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return payment * months;
  return (payment * ((1 + r) ** months - 1)) / (r * (1 + r) ** months);
}

function compute({ income, existingDebt, dtiRatio, rate, years }) {
  const incomeNum = Number(income);
  const debtNum = Number(existingDebt);
  const dtiNum = Number(dtiRatio);
  const rateNum = Number(rate);
  const yearsNum = Number(years);
  const months = yearsNum * 12;
  const valid =
    Number.isFinite(incomeNum) && incomeNum > 0 &&
    Number.isFinite(debtNum) && debtNum >= 0 &&
    Number.isFinite(dtiNum) && dtiNum > 0 && dtiNum <= 100 &&
    Number.isFinite(rateNum) && rateNum >= 0 &&
    Number.isFinite(yearsNum) && yearsNum > 0;
  if (!valid) return { valid: false };
  const maxTotalDebtPayment = incomeNum * (dtiNum / 100);
  const maxMortgagePayment = Math.max(0, maxTotalDebtPayment - debtNum);
  const maxLoanAmount = maxLoanFromPayment(maxMortgagePayment, rateNum, months);
  return { valid: true, maxTotalDebtPayment, maxMortgagePayment, maxLoanAmount };
}

export default createComputeHandler(compute);
