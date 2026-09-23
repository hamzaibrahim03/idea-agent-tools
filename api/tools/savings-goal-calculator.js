import { createComputeHandler } from '../_lib/computeHandler.js';

function monthsToGoal(target, current, monthlyContribution, annualRatePercent) {
  if (target <= current) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    if (monthlyContribution <= 0) return null;
    return Math.ceil((target - current) / monthlyContribution);
  }
  let balance = current;
  let months = 0;
  const maxMonths = 1200;
  while (balance < target && months < maxMonths) {
    balance = balance * (1 + r) + monthlyContribution;
    months += 1;
  }
  if (balance < target) return null;
  return months;
}

function compute({ target, current, monthly, rate }) {
  const targetNum = Number(target);
  const currentNum = Number(current);
  const monthlyNum = Number(monthly);
  const rateNum = Number(rate);
  const valid =
    Number.isFinite(targetNum) && targetNum > 0 &&
    Number.isFinite(currentNum) && currentNum >= 0 &&
    Number.isFinite(monthlyNum) && monthlyNum >= 0 &&
    Number.isFinite(rateNum) && rateNum >= 0;
  const months = valid ? monthsToGoal(targetNum, currentNum, monthlyNum, rateNum) : null;
  const totalContributed = months !== null ? currentNum + monthlyNum * months : null;
  return { valid, months, totalContributed };
}

export default createComputeHandler(compute);
