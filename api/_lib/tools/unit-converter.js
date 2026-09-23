import { createComputeHandler } from '../computeHandler.js';

const CATEGORIES = {
  Length: {
    base: 'meter',
    units: {
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344
    }
  },
  Weight: {
    base: 'kilogram',
    units: {
      milligram: 0.000001,
      gram: 0.001,
      kilogram: 1,
      ounce: 0.0283495,
      pound: 0.453592,
      stone: 6.35029
    }
  },
  Temperature: {
    units: { Celsius: 'C', Fahrenheit: 'F', Kelvin: 'K' }
  }
};

function convertTemperature(value, from, to) {
  if (from === to) return value;
  let celsius;
  if (from === 'Celsius') celsius = value;
  else if (from === 'Fahrenheit') celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;
  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function compute({ category, value, fromUnit, toUnit }) {
  const cat = CATEGORIES[category] ? category : 'Length';
  if (value === '' || value === undefined || value === null || Number.isNaN(Number(value))) {
    return { result: null };
  }
  const num = Number(value);
  let result;
  if (cat === 'Temperature') {
    result = convertTemperature(num, fromUnit, toUnit);
  } else {
    const { units } = CATEGORIES[cat];
    result = (num * units[fromUnit]) / units[toUnit];
  }
  return { result: Number(result.toFixed(6)) };
}

export default createComputeHandler(compute);
