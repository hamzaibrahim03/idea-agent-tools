import { createComputeHandler } from '../_lib/computeHandler.js';
import { webcrypto } from 'node:crypto';

async function hashText(text, algorithm) {
  const bytes = new TextEncoder().encode(text);
  const buffer = await webcrypto.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function compute({ input, algorithm }) {
  if (!input) return { hash: '' };
  const hash = await hashText(input, algorithm);
  return { hash };
}

export default createComputeHandler(compute);
