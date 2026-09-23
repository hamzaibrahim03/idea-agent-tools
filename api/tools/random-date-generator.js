import { webcrypto } from 'node:crypto';
import { createComputeHandler } from '../_lib/computeHandler.js';

function randomInt(maxExclusive) {
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const buf = new Uint32Array(1);
  let n;
  do {
    webcrypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= limit);
  return n % maxExclusive;
}
function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

function compute({ startDate, endDate, count, excludeWeekends }) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { error: 'Enter valid start and end dates.', resultsIso: [] };
  }
  if (start > end) {
    return { error: 'Start date must be on or before the end date.', resultsIso: [] };
  }
  const totalDays = Math.floor((end - start) / 86400000) + 1;
  const candidateDays = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    if (!excludeWeekends || !isWeekend(d)) candidateDays.push(d);
  }
  if (candidateDays.length === 0) {
    return { error: 'No eligible dates in that range (check the weekend exclusion).', resultsIso: [] };
  }
  const howMany = Math.min(Math.max(Number(count) || 1, 1), 50);
  const picked = Array.from({ length: howMany }, () => candidateDays[randomInt(candidateDays.length)]);
  picked.sort((a, b) => a - b);
  return { error: '', resultsIso: picked.map((d) => d.toISOString()) };
}

export default createComputeHandler(compute);
