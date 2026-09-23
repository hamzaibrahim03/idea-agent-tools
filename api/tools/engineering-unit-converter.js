import { createComputeHandler } from '../_lib/computeHandler.js';

const CATEGORIES = {
  Pressure: {
    base: 'pascal',
    units: {
      pascal: 1,
      kilopascal: 1000,
      bar: 100000,
      psi: 6894.76,
      atmosphere: 101325,
      'mm Hg': 133.322
    }
  },
  Force: {
    base: 'newton',
    units: {
      newton: 1,
      kilonewton: 1000,
      'pound-force (lbf)': 4.44822,
      'kilogram-force (kgf)': 9.80665,
      dyne: 0.00001
    }
  },
  'Stress / Load (pressure-based)': {
    base: 'pascal',
    units: {
      pascal: 1,
      megapascal: 1000000,
      kilopascal: 1000,
      psi: 6894.76,
      ksi: 6894760
    }
  }
};

function compute({ category, fromUnit, toUnit, value }) {
  if (value === '' || value === undefined || value === null || Number.isNaN(Number(value))) return { result: null };
  const num = Number(value);
  const { units } = CATEGORIES[category];
  const result = (num * units[fromUnit]) / units[toUnit];
  return { result: Number(result.toPrecision(6)) };
}

export default createComputeHandler(compute);
