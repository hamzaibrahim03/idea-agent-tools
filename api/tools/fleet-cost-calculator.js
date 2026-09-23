import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ vehicleCount, fuelCost, maintenanceCost, insuranceCost }) {
  const vehicleCountNum = Number(vehicleCount);
  const fuelNum = Number(fuelCost);
  const maintenanceNum = Number(maintenanceCost);
  const insuranceNum = Number(insuranceCost);
  const valid =
    Number.isFinite(vehicleCountNum) && vehicleCountNum > 0 &&
    [fuelNum, maintenanceNum, insuranceNum].every((n) => Number.isFinite(n) && n >= 0);
  if (!valid) {
    throw new Error('Enter a positive number of vehicles and non-negative cost values.');
  }
  const costPerVehicleMonthly = fuelNum + maintenanceNum + insuranceNum;
  const totalMonthly = costPerVehicleMonthly * vehicleCountNum;
  const totalAnnual = totalMonthly * 12;
  return { valid, costPerVehicleMonthly, totalMonthly, totalAnnual };
}

export default createComputeHandler(compute);
