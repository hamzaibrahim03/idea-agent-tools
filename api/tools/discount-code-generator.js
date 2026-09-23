import crypto from 'node:crypto';
import { createComputeHandler } from '../_lib/computeHandler.js';

const CHARSETS = {
  alphanumeric: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  letters: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  digits: '0123456789'
};

function generateCode({ prefix, length, charset }) {
  const pool = CHARSETS[charset];
  const bytes = new Uint32Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = crypto.randomBytes(4).readUInt32BE(0);
  }
  const body = Array.from(bytes, (b) => pool[b % pool.length]).join('');
  return `${prefix}${body}`;
}

function compute({ prefix, length, charset, count }) {
  const pool = CHARSETS[charset];
  if (!pool) {
    throw new Error('Invalid character set.');
  }
  const n = Math.min(Math.max(Number(count) || 1, 1), 100);
  const len = Math.min(Math.max(Number(length) || 1, 2), 20);
  const codes = Array.from({ length: n }, () => generateCode({ prefix: (prefix || '').trim(), length: len, charset }));
  return { codes };
}

export default createComputeHandler(compute);
