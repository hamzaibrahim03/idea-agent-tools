import { createComputeHandler } from '../computeHandler.js';

function addMinutes(timeStr, minutes) {
  const [h, m] = timeStr.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  const total = h * 60 + m + minutes;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function compute({ startTime, items }) {
  const list = Array.isArray(items) ? items : [];
  const scheduled = list.reduce((acc, it) => {
    const mins = Number(it.minutes) || 0;
    const cursor = acc.length ? acc[acc.length - 1].nextStart : startTime;
    const nextStart = addMinutes(cursor, mins) || cursor;
    acc.push({ ...it, mins, start: cursor, nextStart });
    return acc;
  }, []);
  const totalMinutes = list.reduce((sum, it) => sum + (Number(it.minutes) || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const endTime = addMinutes(startTime, totalMinutes);
  return { scheduled, totalMinutes, hours, mins, endTime };
}

export default createComputeHandler(compute);
