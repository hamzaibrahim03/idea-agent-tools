import { createComputeHandler } from '../_lib/computeHandler.js';

const VOLUME_UNITS = {
  teaspoon: 4.92892,
  tablespoon: 14.7868,
  'fluid ounce': 29.5735,
  cup: 236.588,
  milliliter: 1,
  liter: 1000
};
const INGREDIENT_GRAMS_PER_CUP = {
  'All-purpose flour': 120,
  'Granulated sugar': 200,
  'Brown sugar (packed)': 220,
  Butter: 227,
  'Rolled oats': 90,
  Honey: 340,
  Rice: 185,
  'Powdered sugar': 120
};

function compute({ value, fromUnit, toUnit, weightValue, ingredient, weightDirection }) {
  const num = Number(value);
  const volumeResult =
    value !== '' && !Number.isNaN(num) ? (num * VOLUME_UNITS[fromUnit]) / VOLUME_UNITS[toUnit] : null;
  const weightNum = Number(weightValue);
  const gramsPerCup = INGREDIENT_GRAMS_PER_CUP[ingredient];
  const weightResult =
    weightValue !== '' && !Number.isNaN(weightNum)
      ? weightDirection === 'cupsToGrams'
        ? weightNum * gramsPerCup
        : weightNum / gramsPerCup
      : null;
  return { volumeResult, weightResult };
}

export default createComputeHandler(compute);
