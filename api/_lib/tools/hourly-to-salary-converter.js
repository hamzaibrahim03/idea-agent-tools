import { createComputeHandler } from '../computeHandler.js';

function compute({ direction, hourlyRate, annualSalary, hoursPerWeek, weeksPerYear }) {
  const hourlyNum = Number(hourlyRate);
  const salaryNum = Number(annualSalary);
  const hoursNum = Number(hoursPerWeek);
  const weeksNum = Number(weeksPerYear);
  const valid =
    Number.isFinite(hoursNum) && hoursNum > 0 &&
    Number.isFinite(weeksNum) && weeksNum > 0 &&
    weeksNum <= 52 &&
    (direction === 'hourlyToSalary' ? Number.isFinite(hourlyNum) && hourlyNum >= 0 : Number.isFinite(salaryNum) && salaryNum >= 0);
  if (!valid) return { valid: false };
  const annual = direction === 'hourlyToSalary' ? hourlyNum * hoursNum * weeksNum : salaryNum;
  const hourly = direction === 'hourlyToSalary' ? hourlyNum : salaryNum / (hoursNum * weeksNum);
  const result = {
    annual,
    monthly: annual / 12,
    weekly: annual / weeksNum,
    hourly
  };
  return { valid: true, result };
}

export default createComputeHandler(compute);
