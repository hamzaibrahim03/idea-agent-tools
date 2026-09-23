import { createComputeHandler } from '../_lib/computeHandler.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function estimateDueDate(lmpDate, nowIso) {
  const lmp = new Date(lmpDate);
  if (Number.isNaN(lmp.getTime())) return null;
  const dueDate = new Date(lmp.getTime() + 280 * MS_PER_DAY);
  const now = nowIso ? new Date(nowIso) : new Date();
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const lmpMidnight = new Date(lmp);
  lmpMidnight.setUTCHours(0, 0, 0, 0);
  const daysSinceLmp = Math.floor((today - lmpMidnight) / MS_PER_DAY);
  const gestationalWeeks = Math.floor(daysSinceLmp / 7);
  const gestationalDays = daysSinceLmp % 7;
  return { dueDateIso: dueDate.toISOString(), daysSinceLmp, gestationalWeeks, gestationalDays };
}

function compute({ lmpDate, nowIso }) {
  const result = estimateDueDate(lmpDate, nowIso);
  return { result };
}

export default createComputeHandler(compute);
