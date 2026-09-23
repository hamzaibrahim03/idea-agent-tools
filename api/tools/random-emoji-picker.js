import { webcrypto } from 'node:crypto';
import { createComputeHandler } from '../_lib/computeHandler.js';

const CATEGORIES = {
  Faces: ['😀', '😂', '🥹', '😉', '😍', '🤔', '😎', '🥳', '😴', '🤯', '😭', '🙃', '🤪', '😇', '🫠'],
  Animals: ['🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🦁', '🐸', '🐵', '🦄', '🐧', '🦉', '🐢', '🐙', '🦋'],
  Food: ['🍕', '🍔', '🌮', '🍣', '🍩', '🍪', '🍉', '🍓', '🥑', '🍇', '🧁', '🍫', '🍿', '🥐', '🍜'],
  Objects: ['💡', '🎈', '🎁', '📚', '🎸', '⌚', '🔑', '🧩', '🎮', '📷', '🕹️', '🧸', '🪁', '🧴', '🛼'],
  Nature: ['🌵', '🌲', '🌸', '🌈', '⭐', '🔥', '🌊', '☀️', '❄️', '🍀', '🌙', '⚡', '🌻', '🍁', '🌴']
};
const ALL_CATEGORY = 'All';

function randomIndex(length) {
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % length);
  let x;
  do {
    x = webcrypto.getRandomValues(new Uint32Array(1))[0];
  } while (x >= limit);
  return x % length;
}
function pickEmojis(pool, count) {
  return Array.from({ length: count }, () => pool[randomIndex(pool.length)]);
}

function compute({ category, count }) {
  const pool = category === ALL_CATEGORY || !CATEGORIES[category] ? Object.values(CATEGORIES).flat() : CATEGORIES[category];
  const n = Math.max(1, Math.min(50, Number(count) || 1));
  return { picked: pickEmojis(pool, n) };
}

export default createComputeHandler(compute);
