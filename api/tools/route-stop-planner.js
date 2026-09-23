import { createComputeHandler } from '../_lib/computeHandler.js';

function formatDuration(hours) {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

function compute({ stops, avgSpeed }) {
  const list = Array.isArray(stops) ? stops : [];
  const speedNum = Number(avgSpeed);
  const speedValid = Number.isFinite(speedNum) && speedNum > 0;
  const totalDistance = list.reduce((sum, s, i) => {
    if (i === 0) return sum;
    const d = Number(s.distanceFromPrev);
    return sum + (Number.isFinite(d) && d >= 0 ? d : 0);
  }, 0);
  const totalHours = speedValid ? totalDistance / speedNum : null;
  const duration = totalHours !== null ? formatDuration(totalHours) : null;
  return { totalDistance, speedValid, duration };
}

export default createComputeHandler(compute);
