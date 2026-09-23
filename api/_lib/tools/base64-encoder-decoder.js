import { createComputeHandler } from '../computeHandler.js';

function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function decodeBase64(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function compute({ input, mode }) {
  if (!input) return { output: '' };
  try {
    const output = mode === 'encode' ? encodeBase64(input) : decodeBase64(input);
    return { output };
  } catch {
    throw new Error(mode === 'encode' ? 'Unable to encode this input.' : 'Invalid Base64 input.');
  }
}

export default createComputeHandler(compute);
