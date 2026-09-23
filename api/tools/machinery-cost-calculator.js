import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ purchasePrice, salvageValue, usefulLifeYears, annualMaintenance, annualHours }) {
  const priceNum = Number(purchasePrice);
  const salvageNum = Number(salvageValue);
  const lifeNum = Number(usefulLifeYears);
  const maintenanceNum = Number(annualMaintenance);
  const hoursNum = Number(annualHours);
  const valid =
    Number.isFinite(priceNum) && priceNum > 0 &&
    Number.isFinite(salvageNum) && salvageNum >= 0 && salvageNum <= priceNum &&
    Number.isFinite(lifeNum) && lifeNum > 0 &&
    Number.isFinite(maintenanceNum) && maintenanceNum >= 0 &&
    Number.isFinite(hoursNum) && hoursNum > 0;
  if (!valid) {
    throw new Error('Enter a positive purchase price, a salvage value between 0 and the purchase price, a positive useful life, non-negative maintenance cost, and positive annual hours.');
  }
  const annualDepreciation = (priceNum - salvageNum) / lifeNum;
  const totalAnnualCost = annualDepreciation + maintenanceNum;
  const costPerHour = totalAnnualCost / hoursNum;
  return { annualDepreciation, totalAnnualCost, costPerHour };
}

export default createComputeHandler(compute);
