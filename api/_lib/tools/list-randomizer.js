import { createComputeHandler } from '../computeHandler.js';
import { randomInt } from 'node:crypto';

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function compute({ items, action }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return { shuffled: [] };
  if (action === 'pickOne') {
    const idx = randomInt(0, list.length);
    return { shuffled: [list[idx]] };
  }
  return { shuffled: shuffle(list) };
}

export default createComputeHandler(compute);
