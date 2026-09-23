import { createComputeHandler } from '../computeHandler.js';

function toMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function compute({ shifts }) {
  const list = Array.isArray(shifts) ? shifts : [];
  const overlapIndices = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      if (a.driver && a.driver.trim() && a.driver === b.driver && a.day === b.day) {
        const aStart = toMinutes(a.start);
        const aEnd = toMinutes(a.end);
        const bStart = toMinutes(b.start);
        const bEnd = toMinutes(b.end);
        if (aStart < bEnd && bStart < aEnd) {
          if (!overlapIndices.includes(i)) overlapIndices.push(i);
          if (!overlapIndices.includes(j)) overlapIndices.push(j);
        }
      }
    }
  }
  return { overlapIndices };
}

export default createComputeHandler(compute);
