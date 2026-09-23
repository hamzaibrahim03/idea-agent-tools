import { createComputeHandler } from '../_lib/computeHandler.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function findConflicts(classes) {
  const conflicts = new Set();
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const a = classes[i];
      const b = classes[j];
      if (a.day !== b.day) continue;
      const aStart = toMinutes(a.start);
      const aEnd = toMinutes(a.end);
      const bStart = toMinutes(b.start);
      const bEnd = toMinutes(b.end);
      if (aStart < bEnd && bStart < aEnd) {
        conflicts.add(i);
        conflicts.add(j);
      }
    }
  }
  return conflicts;
}

function compute({ classes }) {
  const list = Array.isArray(classes) ? classes : [];
  const conflictSet = findConflicts(list);
  const conflicts = Array.from(conflictSet);

  const grid = DAYS.map((day) => {
    const dayClasses = list
      .map((c, i) => ({ ...c, idx: i }))
      .filter((c) => c.day === day)
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    return { day, classes: dayClasses };
  });

  return { conflicts, grid };
}

export default createComputeHandler(compute);
