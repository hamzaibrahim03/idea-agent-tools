import { createComputeHandler } from '../computeHandler.js';

function projectRetirement(currentSavings, monthlyContribution, annualRatePercent, years) {
  const r = annualRatePercent / 100 / 12;
  const months = years * 12;
  const lumpSumGrowth = currentSavings * (1 + r) ** months;
  const contributionGrowth =
    r === 0 ? monthlyContribution * months : monthlyContribution * (((1 + r) ** months - 1) / r);
  const projectedBalance = lumpSumGrowth + contributionGrowth;
  const totalContributed = currentSavings + monthlyContribution * months;
  const totalGrowth = projectedBalance - totalContributed;
  return { projectedBalance, totalContributed, totalGrowth };
}

function compute({ currentAge, retirementAge, currentSavings, monthlyContribution, rate }) {
  const currentAgeNum = Number(currentAge);
  const retirementAgeNum = Number(retirementAge);
  const currentSavingsNum = Number(currentSavings);
  const monthlyNum = Number(monthlyContribution);
  const rateNum = Number(rate);
  const years = retirementAgeNum - currentAgeNum;
  const valid =
    Number.isFinite(currentAgeNum) && currentAgeNum > 0 &&
    Number.isFinite(retirementAgeNum) &&
    Number.isFinite(currentSavingsNum) && currentSavingsNum >= 0 &&
    Number.isFinite(monthlyNum) && monthlyNum >= 0 &&
    Number.isFinite(rateNum) && rateNum >= 0 &&
    years > 0;
  const result = valid ? projectRetirement(currentSavingsNum, monthlyNum, rateNum, years) : null;
  return { valid, years, result };
}

export default createComputeHandler(compute);
