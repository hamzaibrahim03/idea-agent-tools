import { createComputeHandler } from '../_lib/computeHandler.js';
import { randomUUID } from 'node:crypto';

function compute({ count, uppercase }) {
  const n = Math.min(Math.max(Number(count) || 1, 1), 100);
  const uuids = Array.from({ length: n }, () => randomUUID());
  const displayed = uuids.map((u) => (uppercase ? u.toUpperCase() : u));
  return { uuids: displayed };
}

export default createComputeHandler(compute);
