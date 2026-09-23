import { createComputeHandler } from '../computeHandler.js';

function calculateAge(birthDate, onDate) {
  const birth = new Date(birthDate);
  const on = new Date(onDate);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(on.getTime())) return null;
  if (birth > on) return null;
  let years = on.getFullYear() - birth.getFullYear();
  let months = on.getMonth() - birth.getMonth();
  let days = on.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(on.getFullYear(), on.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((on - birth) / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
}

function compute({ birthDate, onDate }) {
  const result = calculateAge(birthDate, onDate);
  return { result };
}

export default createComputeHandler(compute);
