import { createComputeHandler } from '../computeHandler.js';

const STATUSES = ['applied', 'interview', 'offer', 'rejected'];

function compute({ applications, filter }) {
  const list = Array.isArray(applications) ? applications : [];
  const withIndex = list.map((a, i) => ({ ...a, _idx: i }));
  const counts = { all: list.length };
  STATUSES.forEach((s) => {
    counts[s] = list.filter((a) => a.status === s).length;
  });
  const filtered = filter === 'all' ? withIndex : withIndex.filter((a) => a.status === filter);
  return { filtered, counts };
}

export default createComputeHandler(compute);
