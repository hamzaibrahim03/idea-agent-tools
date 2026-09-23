import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ maxCapacity, items }) {
  const capacityNum = Number(maxCapacity);
  const capacityValid = Number.isFinite(capacityNum) && capacityNum > 0;
  const list = Array.isArray(items) ? items : [];
  const totalWeight = list.reduce((sum, it) => {
    const w = Number(it.weight);
    return sum + (Number.isFinite(w) && w >= 0 ? w : 0);
  }, 0);
  const remaining = capacityValid ? capacityNum - totalWeight : null;
  const overCapacity = capacityValid && totalWeight > capacityNum;
  return { capacityValid, capacityNum, totalWeight, remaining, overCapacity };
}

export default createComputeHandler(compute);
