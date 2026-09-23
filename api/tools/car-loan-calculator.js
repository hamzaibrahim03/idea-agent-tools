import { createComputeHandler } from '../_lib/computeHandler.js';

function carLoanPayment(loanAmount, annualRatePercent, months) {
  if (loanAmount <= 0 || months <= 0) return null;
  const r = annualRatePercent / 12 / 100;
  const payment = r === 0 ? loanAmount / months : (loanAmount * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const totalPayment = payment * months;
  const totalInterest = totalPayment - loanAmount;
  return { payment, totalPayment, totalInterest };
}

function compute({ price, downPayment, tradeIn, rate, term }) {
  const priceNum = Number(price);
  const downNum = Number(downPayment);
  const tradeNum = Number(tradeIn);
  const rateNum = Number(rate);
  const termNum = Number(term);
  const loanAmount = priceNum - downNum - tradeNum;
  const valid =
    Number.isFinite(priceNum) && priceNum > 0 &&
    Number.isFinite(downNum) && downNum >= 0 &&
    Number.isFinite(tradeNum) && tradeNum >= 0 &&
    Number.isFinite(rateNum) && rateNum >= 0 &&
    Number.isFinite(termNum) && termNum > 0 &&
    loanAmount > 0;
  const result = valid ? carLoanPayment(loanAmount, rateNum, termNum) : null;
  return { valid, loanAmount, result };
}

export default createComputeHandler(compute);
