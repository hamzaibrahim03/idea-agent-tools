import { createComputeHandler } from '../computeHandler.js';

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  return Buffer.from(padded, 'base64').toString('utf-8');
}

function decodeJwt(token) {
  const parts = token.trim().split('.');
  if (parts.length < 2) {
    throw new Error('Not a valid JWT (expected header.payload.signature)');
  }
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  return { header, payload, signature: parts[2] || '' };
}

function compute({ input }) {
  if (!input || !String(input).trim()) return { header: null, payload: null, signature: '' };
  return decodeJwt(input);
}

export default createComputeHandler(compute);
