import crypto from 'node:crypto';
import { createComputeHandler } from '../_lib/computeHandler.js';

const YES_NO_MAYBE = ['Yes', 'No', 'Maybe'];

function randomIndex(length) {
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % length);
  let x;
  do {
    x = crypto.randomBytes(4).readUInt32BE(0);
  } while (x >= limit);
  return x % length;
}

function compute({ mode, options }) {
  if (mode === 'options') {
    const list = Array.isArray(options) ? options.filter((o) => typeof o === 'string' && o.trim()) : [];
    if (list.length === 0) {
      throw new Error('Add at least one option.');
    }
    return { result: list[randomIndex(list.length)] };
  }
  return { result: YES_NO_MAYBE[randomIndex(YES_NO_MAYBE.length)] };
}

export default createComputeHandler(compute);
