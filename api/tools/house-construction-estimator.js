import { createComputeHandler } from '../_lib/computeHandler.js';

const BREAKDOWN = [
  { key: 'structure', label: 'Structure (foundation, frame, walls, roof)', pct: 43 },
  { key: 'finishing', label: 'Finishing (flooring, paint, doors, windows, fixtures)', pct: 30 },
  { key: 'electrical', label: 'Electrical', pct: 8 },
  { key: 'plumbing', label: 'Plumbing', pct: 7 },
  { key: 'other', label: 'Other (site prep, permits, contingency)', pct: 12 }
];

function compute({ builtUpArea, floors, rate }) {
  const areaNum = Number(builtUpArea);
  const floorsNum = Number(floors);
  const rateNum = Number(rate);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(floorsNum) && floorsNum > 0 &&
    Number.isFinite(rateNum) && rateNum > 0;
  if (!valid) return { valid: false };
  const totalArea = areaNum * floorsNum;
  const totalCost = totalArea * rateNum;
  const breakdown = BREAKDOWN.map((b) => ({ ...b, cost: (totalCost * b.pct) / 100 }));
  return { valid: true, totalArea, totalCost, breakdown };
}

export default createComputeHandler(compute);
