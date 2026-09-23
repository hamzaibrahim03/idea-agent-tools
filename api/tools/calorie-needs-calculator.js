import { createComputeHandler } from '../_lib/computeHandler.js';

function mifflinStJeor(sex, weightKg, heightCm, age) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function compute({ sex, age, heightCm, weightKg, activityFactor }) {
  const ageNum = Number(age);
  const heightNum = Number(heightCm);
  const weightNum = Number(weightKg);
  const activityNum = Number(activityFactor);
  const valid =
    Number.isFinite(ageNum) && ageNum > 0 &&
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(weightNum) && weightNum > 0 &&
    Number.isFinite(activityNum) && activityNum > 0;
  const bmr = valid ? mifflinStJeor(sex, weightNum, heightNum, ageNum) : null;
  const tdee = bmr !== null ? bmr * activityNum : null;
  return { valid, bmr, tdee };
}

export default createComputeHandler(compute);
