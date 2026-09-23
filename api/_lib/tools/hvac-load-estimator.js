import { createComputeHandler } from '../computeHandler.js';

const BTU_PER_TON = 12000;

function compute({ area, btuPerSqFt }) {
  const areaNum = Number(area);
  const btuNum = Number(btuPerSqFt);
  const valid = Number.isFinite(areaNum) && areaNum > 0 && Number.isFinite(btuNum) && btuNum > 0;
  if (!valid) return { valid: false };
  const totalBtu = areaNum * btuNum;
  const tons = totalBtu / BTU_PER_TON;
  return { valid: true, totalBtu, tons };
}

export default createComputeHandler(compute);
