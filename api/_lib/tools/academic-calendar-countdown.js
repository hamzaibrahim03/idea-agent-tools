import { createComputeHandler } from '../computeHandler.js';

function daysUntil(dateStr) {
  const target = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - startOfToday.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function compute({ events }) {
  const list = Array.isArray(events) ? events : [];
  const withCountdown = list
    .filter((e) => e && e.name && e.name.trim() && e.date)
    .map((e) => ({ ...e, days: daysUntil(e.date) }))
    .filter((e) => e.days !== null)
    .sort((a, b) => a.days - b.days);
  return { withCountdown };
}

export default createComputeHandler(compute);
