import { createComputeHandler } from '../computeHandler.js';

function sortTimes(times) {
  return [...times].sort((a, b) => a.localeCompare(b));
}

function compute({ medications }) {
  const list = Array.isArray(medications) ? medications : [];
  const byTime = {};
  list.forEach((m) => {
    (m.times || []).forEach((t) => {
      if (!byTime[t]) byTime[t] = [];
      byTime[t].push(m);
    });
  });
  const sortedTimeKeys = sortTimes(Object.keys(byTime));
  return { byTime, sortedTimeKeys };
}

export default createComputeHandler(compute);
