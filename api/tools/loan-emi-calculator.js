import { createComputeHandler } from '../_lib/computeHandler.js';

function emiFormula(principal, annualRatePercent, months) {
  if (principal <= 0 || months <= 0) return null;
  const r = annualRatePercent / 12 / 100;
  const emi = r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}

function compute({ principal, rate, term, termUnit }) {
  const principalNum = Number(principal);
  const rateNum = Number(rate);
  const termNum = Number(term);
  const months = termUnit === 'years' ? termNum * 12 : termNum;
  const valid = Number.isFinite(principalNum) && principalNum > 0 && Number.isFinite(rateNum) && rateNum >= 0 && Number.isFinite(months) && months > 0;
  if (!valid) {
    throw new Error('Enter a positive loan amount, a non-negative interest rate, and a positive term.');
  }
  const result = emiFormula(principalNum, rateNum, months);
  return { ...result, months };
}

export default createComputeHandler(compute);
