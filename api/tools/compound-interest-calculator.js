import { createComputeHandler } from '../_lib/computeHandler.js';

function compoundInterest(principal, annualRatePercent, years, compoundsPerYear, monthlyContribution) {
  const r = annualRatePercent / 100;
  const n = compoundsPerYear;
  const periods = years * n;
  const ratePerPeriod = r / n;
  const principalGrowth = principal * (1 + ratePerPeriod) ** periods;
  let contributionGrowth = 0;
  if (monthlyContribution > 0) {
    const contributionPerPeriod = (monthlyContribution * 12) / n;
    contributionGrowth = ratePerPeriod === 0
      ? contributionPerPeriod * periods
      : contributionPerPeriod * (((1 + ratePerPeriod) ** periods - 1) / ratePerPeriod);
  }
  const finalBalance = principalGrowth + contributionGrowth;
  const totalContributed = principal + monthlyContribution * 12 * years;
  const totalInterest = finalBalance - totalContributed;
  return { finalBalance, totalContributed, totalInterest };
}

function compute({ principal, rate, years, compounds, monthly }) {
  const principalNum = Number(principal);
  const rateNum = Number(rate);
  const yearsNum = Number(years);
  const compoundsNum = Number(compounds);
  const monthlyNum = Number(monthly);
  const valid =
    Number.isFinite(principalNum) && principalNum >= 0 &&
    Number.isFinite(rateNum) &&
    Number.isFinite(yearsNum) && yearsNum > 0 &&
    Number.isFinite(compoundsNum) && compoundsNum > 0 &&
    Number.isFinite(monthlyNum) && monthlyNum >= 0;
  if (!valid) {
    throw new Error('Enter a non-negative initial amount, a positive number of years, and non-negative contribution.');
  }
  const result = compoundInterest(principalNum, rateNum, yearsNum, compoundsNum, monthlyNum);
  return { result };
}

export default createComputeHandler(compute);
