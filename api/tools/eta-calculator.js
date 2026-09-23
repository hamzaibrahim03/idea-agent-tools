import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ distance, speed, startTime }) {
  const distanceNum = Number(distance);
  const speedNum = Number(speed);
  const valid = Number.isFinite(distanceNum) && distanceNum > 0 && Number.isFinite(speedNum) && speedNum > 0 && /^\d{2}:\d{2}$/.test(startTime);
  if (!valid) return { valid: false };
  const travelHours = distanceNum / speedNum;
  const [h, m] = startTime.split(':').map(Number);
  const startMinutes = h * 60 + m;
  const travelMinutes = Math.round(travelHours * 60);
  const totalMinutes = startMinutes + travelMinutes;
  const dayOffset = Math.floor(totalMinutes / 1440);
  const etaMinutesOfDay = ((totalMinutes % 1440) + 1440) % 1440;
  const etaH = Math.floor(etaMinutesOfDay / 60);
  const etaM = etaMinutesOfDay % 60;
  const etaLabel = `${String(etaH).padStart(2, '0')}:${String(etaM).padStart(2, '0')}`;
  return { valid: true, travelHours, etaLabel, dayOffset };
}

export default createComputeHandler(compute);
