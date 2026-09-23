import { createComputeHandler } from '../_lib/computeHandler.js';
import { webcrypto } from 'node:crypto';

async function computeHmac(message, key, algorithm) {
  const keyBytes = new TextEncoder().encode(key);
  const messageBytes = new TextEncoder().encode(message);
  const cryptoKey = await webcrypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );
  const signature = await webcrypto.subtle.sign('HMAC', cryptoKey, messageBytes);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function compute({ message, key, algorithm }) {
  if (!message || !key) return { hmac: '' };
  try {
    const hmac = await computeHmac(message, key, algorithm);
    return { hmac };
  } catch (e) {
    throw new Error(e.message || 'Unable to compute HMAC.');
  }
}

export default createComputeHandler(compute);
