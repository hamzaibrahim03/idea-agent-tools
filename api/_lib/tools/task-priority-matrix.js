import { createComputeHandler } from '../computeHandler.js';

const QUADRANTS = [
  { key: 'do', title: 'Do (urgent & important)', match: (u, i) => u && i },
  { key: 'schedule', title: 'Schedule (important, not urgent)', match: (u, i) => !u && i },
  { key: 'delegate', title: 'Delegate (urgent, not important)', match: (u, i) => u && !i },
  { key: 'delete', title: 'Delete (neither urgent nor important)', match: (u, i) => !u && !i }
];

function compute({ tasks }) {
  const list = Array.isArray(tasks) ? tasks : [];
  const quadrants = QUADRANTS.map((q) => ({
    key: q.key,
    title: q.title,
    tasks: list.filter((t) => q.match(!!t.urgent, !!t.important)).map((t) => t.text)
  }));
  return { quadrants };
}

export default createComputeHandler(compute);
