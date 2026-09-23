import { createComputeHandler } from '../computeHandler.js';

const MAX_SIEVE = 1000000;

function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function primesUpTo(limit) {
  const sieve = new Uint8Array(limit + 1);
  const result = [];
  for (let i = 2; i <= limit; i++) {
    if (!sieve[i]) {
      result.push(i);
      for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
    }
  }
  return result;
}

function compute({ number, limit }) {
  const checkResult = (() => {
    if ((number || '').trim() === '') return null;
    const n = Number(number);
    if (!Number.isInteger(n)) return { error: 'Enter a whole number.' };
    return { prime: isPrime(n), n };
  })();
  const sieveResult = (() => {
    if ((limit || '').trim() === '') return null;
    const n = Number(limit);
    if (!Number.isInteger(n) || n < 2) return { error: 'Enter a whole number of at least 2.' };
    if (n > MAX_SIEVE) return { error: `Limit is capped at ${MAX_SIEVE.toLocaleString()} to avoid freezing the browser.` };
    return { primes: primesUpTo(n) };
  })();
  return { checkResult, sieveResult };
}

export default createComputeHandler(compute);
