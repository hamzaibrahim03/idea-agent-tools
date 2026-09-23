import { createComputeHandler } from '../_lib/computeHandler.js';

function daysUntil(dateStr) {
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function compute({ appointments }) {
  const list = Array.isArray(appointments) ? appointments : [];
  const sorted = [...list].sort((a, b) => {
    const aKey = `${a.date}T${a.time || '00:00'}`;
    const bKey = `${b.date}T${b.time || '00:00'}`;
    return aKey.localeCompare(bKey);
  });
  const withCountdown = sorted.map((a) => {
    const days = daysUntil(a.date);
    let countdown;
    if (days < 0) countdown = `${Math.abs(days)} day(s) ago`;
    else if (days === 0) countdown = 'Today';
    else if (days === 1) countdown = 'Tomorrow';
    else countdown = `In ${days} days`;
    return { ...a, days, countdown };
  });
  return { sorted: withCountdown };
}

export default createComputeHandler(compute);
