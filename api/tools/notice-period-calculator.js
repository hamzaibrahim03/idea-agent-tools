import { createComputeHandler } from '../_lib/computeHandler.js';

function addDaysSkippingWeekends(start, totalDays, excludeWeekends) {
  const cursor = new Date(start);
  if (!excludeWeekends) {
    cursor.setUTCDate(cursor.getUTCDate() + totalDays);
    return cursor;
  }
  let remaining = totalDays;
  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return cursor;
}

function compute({ resignationDate, unit, length, excludeWeekends }) {
  const start = new Date(`${resignationDate}T12:00:00Z`);
  const lengthNum = Number(length);
  const valid = !Number.isNaN(start.getTime()) && Number.isFinite(lengthNum) && lengthNum > 0;
  let lastDayIso = null;
  let totalCalendarDays = 0;
  if (valid) {
    totalCalendarDays = unit === 'weeks' ? lengthNum * 7 : lengthNum;
    const lastDay = addDaysSkippingWeekends(start, totalCalendarDays, excludeWeekends);
    lastDayIso = lastDay.toISOString();
  }
  return { valid, lastDayIso, totalCalendarDays };
}

export default createComputeHandler(compute);
