import { createComputeHandler } from '../_lib/computeHandler.js';

function bmiCategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function compute({ unit, heightCm, weightKg, heightFt, heightIn, weightLb }) {
  let bmi = null;
  if (unit === 'metric') {
    const h = Number(heightCm) / 100;
    const w = Number(weightKg);
    if (h && w) {
      bmi = w / (h * h);
    }
  } else {
    const totalInches = Number(heightFt) * 12 + Number(heightIn);
    const w = Number(weightLb);
    if (totalInches && w) {
      bmi = (w / (totalInches * totalInches)) * 703;
    }
  }
  const category = bmi !== null ? bmiCategory(bmi) : null;
  return { bmi, category };
}

export default createComputeHandler(compute);
