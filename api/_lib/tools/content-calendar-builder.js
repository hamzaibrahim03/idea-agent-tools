import { createComputeHandler } from '../computeHandler.js';

function getWeekKey(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return 'Unscheduled';
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = target - firstThursday;
  const week = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
  return `${target.getFullYear()} - Week ${week}`;
}

function compute({ items }) {
  const list = Array.isArray(items) ? items : [];
  const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
  const groups = new Map();
  sorted.forEach((item) => {
    const key = getWeekKey(item.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return { grouped: Array.from(groups.entries()) };
}

export default createComputeHandler(compute);
