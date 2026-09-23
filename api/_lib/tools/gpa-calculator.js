import { createComputeHandler } from '../computeHandler.js';

const GRADE_POINTS = {
  'A+': 4.0, A: 4.0, 'A-': 3.7,
  'B+': 3.3, B: 3.0, 'B-': 2.7,
  'C+': 2.3, C: 2.0, 'C-': 1.7,
  'D+': 1.3, D: 1.0, F: 0.0
};
function computeGpa(courses) {
  let totalPoints = 0;
  let totalCredits = 0;
  for (const c of courses) {
    const credits = Number(c.credits);
    const points = GRADE_POINTS[c.grade];
    if (!Number.isFinite(credits) || credits <= 0 || points === undefined) continue;
    totalPoints += credits * points;
    totalCredits += credits;
  }
  return totalCredits > 0 ? totalPoints / totalCredits : null;
}

function compute({ courses }) {
  const list = courses || [];
  const gpa = computeGpa(list);
  const totalCredits = list.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  return { gpa, totalCredits };
}

export default createComputeHandler(compute);
