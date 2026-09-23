import { createComputeHandler } from '../computeHandler.js';

function compute({ distance, efficiency, fuelPrice, tankRange, unit }) {
  const d = parseFloat(distance) || 0;
  const eff = parseFloat(efficiency) || 0;
  const price = parseFloat(fuelPrice) || 0;
  const range = parseFloat(tankRange) || 0;
  const isMetric = unit === 'km/L';
  const fuelUnitLabel = isMetric ? 'L' : 'gal';
  const fuelNeeded = eff > 0 ? d / eff : 0;
  const totalCost = fuelNeeded * price;
  const stops = range > 0 ? Math.max(0, Math.ceil(d / range) - 1) : 0;
  return { d, eff, range, fuelUnitLabel, fuelNeeded, totalCost, stops };
}

export default createComputeHandler(compute);
