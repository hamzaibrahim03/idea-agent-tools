import { createComputeHandler } from '../computeHandler.js';

function compute({ total, people }) {
  const list = Array.isArray(people) ? people : [];
  const totalNum = Number(total);
  const shares = list.map((p) => Number(p.share) || 0);
  const totalShares = shares.reduce((sum, s) => sum + s, 0);
  const valid = Number.isFinite(totalNum) && totalNum >= 0 && totalShares > 0;
  const amounts = valid ? shares.map((s) => (totalNum * s) / totalShares) : [];
  return { valid, amounts };
}

export default createComputeHandler(compute);
