import { createComputeHandler } from '../computeHandler.js';

function compute({ area, wattsPerSqFt, voltage }) {
  const areaNum = Number(area);
  const wattsNum = Number(wattsPerSqFt);
  const voltageNum = Number(voltage);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(wattsNum) && wattsNum > 0 &&
    Number.isFinite(voltageNum) && voltageNum > 0;
  if (!valid) {
    throw new Error('Enter positive values for floor area, lighting load factor, and voltage.');
  }
  const totalWatts = areaNum * wattsNum;
  const totalAmps = totalWatts / voltageNum;
  return { totalWatts, totalAmps };
}

export default createComputeHandler(compute);
