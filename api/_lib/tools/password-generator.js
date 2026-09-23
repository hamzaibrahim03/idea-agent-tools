import { webcrypto } from 'node:crypto';
import { createComputeHandler } from '../computeHandler.js';

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = /[Il1O0]/;

function compute({ length, lower, upper, digits, symbols, excludeAmbiguous }) {
  const len = Number(length);
  if (!Number.isFinite(len) || len <= 0) {
    throw new Error('Invalid length');
  }
  let pool = '';
  if (lower) pool += LOWER;
  if (upper) pool += UPPER;
  if (digits) pool += DIGITS;
  if (symbols) pool += SYMBOLS;
  if (excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  if (!pool) return { password: '' };
  const bytes = new Uint32Array(len);
  webcrypto.getRandomValues(bytes);
  const password = Array.from(bytes, (b) => pool[b % pool.length]).join('');
  return { password };
}

export default createComputeHandler(compute);
