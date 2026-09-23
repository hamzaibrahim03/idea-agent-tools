import { createComputeHandler } from '../computeHandler.js';

function breakdownTimeUntil(fromDate, toDate) {
  if (toDate <= fromDate) return null;
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let cursor = new Date(fromDate);
  cursor.setFullYear(cursor.getFullYear() + years);
  cursor.setMonth(cursor.getMonth() + months);
  if (cursor > toDate) {
    months -= 1;
    cursor = new Date(fromDate);
    cursor.setFullYear(fromDate.getFullYear() + years);
    cursor.setMonth(fromDate.getMonth() + months);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
    cursor = new Date(fromDate);
    cursor.setFullYear(fromDate.getFullYear() + years);
    cursor.setMonth(fromDate.getMonth() + months);
  }
  let remainingMs = toDate.getTime() - cursor.getTime();
  const msPerMinute = 60000;
  const msPerHour = 3600000;
  const msPerDay = 86400000;
  const msPerWeek = msPerDay * 7;
  const weeks = Math.floor(remainingMs / msPerWeek);
  remainingMs -= weeks * msPerWeek;
  const days = Math.floor(remainingMs / msPerDay);
  remainingMs -= days * msPerDay;
  const hours = Math.floor(remainingMs / msPerHour);
  remainingMs -= hours * msPerHour;
  const minutes = Math.floor(remainingMs / msPerMinute);
  return { years, months, weeks, days, hours, minutes };
}

function formatBreakdown(b) {
  const units = [
    ['year', b.years],
    ['month', b.months],
    ['week', b.weeks],
    ['day', b.days],
    ['hour', b.hours],
    ['minute', b.minutes]
  ].filter(([, value]) => value > 0);
  if (units.length === 0) return 'Less than a minute';
  return units.map(([label, value]) => `${value} ${label}${value === 1 ? '' : 's'}`).join(', ');
}

function compute({ target }) {
  const targetDate = target ? new Date(target) : null;
  const valid = !!(targetDate && !Number.isNaN(targetDate.getTime()));
  if (!valid) return { valid: false, breakdown: null, formatted: null };
  const breakdown = breakdownTimeUntil(new Date(), targetDate);
  return { valid: true, breakdown, formatted: breakdown ? formatBreakdown(breakdown) : null };
}

export default createComputeHandler(compute);
