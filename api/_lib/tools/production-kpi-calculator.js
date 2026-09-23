import { createComputeHandler } from '../computeHandler.js';

function compute({ useAvailInputs, availability, plannedTime, actualTime, usePerfInputs, performance, idealCycle, totalCount, runTime, quality }) {
  const plannedNum = Number(plannedTime);
  const actualNum = Number(actualTime);
  const availFromTime = plannedNum > 0 ? (actualNum / plannedNum) * 100 : null;
  const effectiveAvailability = useAvailInputs ? availFromTime : Number(availability);
  const idealNum = Number(idealCycle);
  const totalCountNum = Number(totalCount);
  const runTimeNum = Number(runTime);
  const perfFromCycle = runTimeNum > 0 ? ((idealNum * totalCountNum) / runTimeNum) * 100 : null;
  const effectivePerformance = usePerfInputs ? perfFromCycle : Number(performance);
  const qualityNum = Number(quality);
  const valid =
    Number.isFinite(effectiveAvailability) &&
    Number.isFinite(effectivePerformance) &&
    Number.isFinite(qualityNum);
  const oee = valid ? (effectiveAvailability / 100) * (effectivePerformance / 100) * (qualityNum / 100) * 100 : null;
  return { valid, effectiveAvailability, effectivePerformance, qualityNum, oee };
}

export default createComputeHandler(compute);
