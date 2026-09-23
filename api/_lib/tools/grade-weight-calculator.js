import { createComputeHandler } from '../computeHandler.js';

function compute({ categories }) {
  const list = categories || [];
  const totalWeight = list.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const weightedSum = list.reduce((sum, c) => {
    const weight = Number(c.weight) || 0;
    const score = Number(c.score) || 0;
    return sum + weight * score;
  }, 0);
  const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : null;
  return { totalWeight, finalGrade };
}

export default createComputeHandler(compute);
