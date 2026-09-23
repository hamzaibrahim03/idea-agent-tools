import { createComputeHandler } from '../_lib/computeHandler.js';

function minimumHourlyRate(desiredIncome, billableHoursPerWeek, weeksPerYear, annualOverhead) {
  const billableHoursPerYear = billableHoursPerWeek * weeksPerYear;
  if (billableHoursPerYear <= 0) return null;
  const requiredRevenue = desiredIncome + annualOverhead;
  return { rate: requiredRevenue / billableHoursPerYear, billableHoursPerYear, requiredRevenue };
}

function compute({ desiredIncome, billableHours, weeksPerYear, overhead }) {
  const incomeNum = Number(desiredIncome);
  const hoursNum = Number(billableHours);
  const weeksNum = Number(weeksPerYear);
  const overheadNum = Number(overhead);
  const valid =
    Number.isFinite(incomeNum) && incomeNum > 0 &&
    Number.isFinite(hoursNum) && hoursNum > 0 &&
    Number.isFinite(weeksNum) && weeksNum > 0 && weeksNum <= 52 &&
    Number.isFinite(overheadNum) && overheadNum >= 0;
  if (!valid) {
    throw new Error('Enter a positive income, positive hours/week, weeks/year between 1 and 52, and a non-negative overhead amount.');
  }
  const result = minimumHourlyRate(incomeNum, hoursNum, weeksNum, overheadNum);
  return { valid, result };
}

export default createComputeHandler(compute);
