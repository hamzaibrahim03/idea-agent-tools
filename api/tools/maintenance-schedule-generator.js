import { createComputeHandler } from '../_lib/computeHandler.js';

function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d;
}

function compute({ equipment }) {
  const list = Array.isArray(equipment) ? equipment : [];
  const now = new Date();
  const rows = list
    .map((e) => {
      const interval = Number(e.intervalDays);
      const validRow = Number.isFinite(interval) && interval > 0 && !!e.lastServiced;
      if (!validRow) return { ...e, validRow, dueDate: null, daysUntilDue: null };
      const dueDate = addDays(e.lastServiced, interval);
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      return { ...e, validRow, dueDate: dueDate.toISOString().slice(0, 10), daysUntilDue };
    });
  const sorted = [...rows].sort((a, b) => {
    if (a.daysUntilDue === null) return 1;
    if (b.daysUntilDue === null) return -1;
    return a.daysUntilDue - b.daysUntilDue;
  });
  return { rows, sorted };
}

export default createComputeHandler(compute);
