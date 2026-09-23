import { createComputeHandler } from '../_lib/computeHandler.js';

function parseLocalDate(dateStr) {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return new Date(NaN);
  const [y, m, d] = parts;
  return new Date(Date.UTC(y, m - 1, d));
}
function addDaysUTC(date, days) {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function compute({ startDate, phases }) {
  const start = startDate ? parseLocalDate(startDate) : null;
  const validStart = start instanceof Date && !Number.isNaN(start.getTime());
  const { schedule, totalDays } = (phases || []).reduce(
    (acc, p) => {
      const durationNum = Number(p.days);
      const validPhase = validStart && Number.isFinite(durationNum) && durationNum > 0;
      if (!validPhase) {
        acc.schedule.push({ name: p.name, days: p.days, validPhase: false });
        return acc;
      }
      const phaseStart = acc.cursor;
      const phaseEnd = addDaysUTC(acc.cursor, durationNum - 1);
      acc.schedule.push({ name: p.name, days: p.days, validPhase: true, startIso: phaseStart.toISOString(), endIso: phaseEnd.toISOString() });
      acc.cursor = addDaysUTC(acc.cursor, durationNum);
      acc.totalDays += durationNum;
      return acc;
    },
    { schedule: [], totalDays: 0, cursor: start }
  );
  const allValid = validStart && schedule.every((s) => s.validPhase);
  const projectEndIso = allValid && schedule.length > 0 ? schedule[schedule.length - 1].endIso : null;
  return { validStart, schedule, totalDays, allValid, projectEndIso };
}

export default createComputeHandler(compute);
