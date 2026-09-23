import { createComputeHandler } from '../computeHandler.js';

const WEIGHT_TO_OZ = { oz: 1, lb: 16, g: 0.035274, kg: 35.274 };

function compute({ bulkCost, bulkQuantity, bulkUnit, portionSize, portionUnit }) {
  const costNum = Number(bulkCost);
  const bulkQtyNum = Number(bulkQuantity);
  const portionNum = Number(portionSize);
  const valid =
    Number.isFinite(costNum) && costNum >= 0 &&
    Number.isFinite(bulkQtyNum) && bulkQtyNum > 0 &&
    Number.isFinite(portionNum) && portionNum > 0;
  let costPerPortion = null;
  let portionsAvailable = null;
  if (valid) {
    const bulkQtyInOz = bulkQtyNum * WEIGHT_TO_OZ[bulkUnit];
    const portionInOz = portionNum * WEIGHT_TO_OZ[portionUnit];
    const costPerOz = costNum / bulkQtyInOz;
    costPerPortion = costPerOz * portionInOz;
    portionsAvailable = bulkQtyInOz / portionInOz;
  }
  return { valid, costPerPortion, portionsAvailable };
}

export default createComputeHandler(compute);
