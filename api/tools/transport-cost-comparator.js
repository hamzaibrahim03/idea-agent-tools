import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ options, sortBy }) {
  const list = Array.isArray(options) ? options : [];
  const withValues = list.map((o) => ({
    ...o,
    costNum: parseFloat(o.cost) || 0,
    durationNum: parseFloat(o.duration) || 0
  }));
  const filled = withValues.filter((o) => o.cost !== '' || o.duration !== '');
  const sorted = [...filled].sort((a, b) =>
    sortBy === 'cost' ? a.costNum - b.costNum : a.durationNum - b.durationNum
  );
  return { sorted };
}

export default createComputeHandler(compute);
