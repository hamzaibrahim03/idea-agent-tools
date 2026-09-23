import { createComputeHandler } from '../computeHandler.js';

const GRADE_BANDS = [
  { min: 97, letter: 'A+', gpa: 4.0 },
  { min: 93, letter: 'A', gpa: 4.0 },
  { min: 90, letter: 'A-', gpa: 3.7 },
  { min: 87, letter: 'B+', gpa: 3.3 },
  { min: 83, letter: 'B', gpa: 3.0 },
  { min: 80, letter: 'B-', gpa: 2.7 },
  { min: 77, letter: 'C+', gpa: 2.3 },
  { min: 73, letter: 'C', gpa: 2.0 },
  { min: 70, letter: 'C-', gpa: 1.7 },
  { min: 67, letter: 'D+', gpa: 1.3 },
  { min: 63, letter: 'D', gpa: 1.0 },
  { min: 60, letter: 'D-', gpa: 0.7 },
  { min: -Infinity, letter: 'F', gpa: 0.0 }
];
function gradeForPercent(percent) {
  return GRADE_BANDS.find((band) => percent >= band.min);
}

function compute({ percent }) {
  const percentNum = Number(percent);
  const valid = Number.isFinite(percentNum) && percentNum >= 0 && percentNum <= 100;
  if (!valid) return { valid: false };
  const grade = gradeForPercent(percentNum);
  return { valid: true, grade };
}

export default createComputeHandler(compute);
