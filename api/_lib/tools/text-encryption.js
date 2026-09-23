import { createComputeHandler } from '../computeHandler.js';
import { webcrypto } from 'node:crypto';

const subtle = webcrypto.subtle;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const PBKDF2_ITERATIONS = 100000;

async function deriveKey(password, salt) {
  const baseKey = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bytesToBase64(bytes) {
  return Buffer.from(bytes).toString('base64');
}
function base64ToBytes(base64) {
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

async function encryptText(plaintext, password) {
  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(password, salt);
  const ciphertext = await subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return bytesToBase64(combined);
}

async function decryptText(encoded, password) {
  const combined = base64ToBytes(encoded);
  const salt = combined.slice(0, SALT_BYTES);
  const iv = combined.slice(SALT_BYTES, SALT_BYTES + IV_BYTES);
  const ciphertext = combined.slice(SALT_BYTES + IV_BYTES);
  const key = await deriveKey(password, salt);
  const plainBuffer = await subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(plainBuffer);
}

async function compute({ mode, input, password }) {
  if (!input || !String(input).trim() || !password) {
    throw new Error('Text and password are required.');
  }
  try {
    if (mode === 'encrypt') {
      const output = await encryptText(input, password);
      return { output };
    }
    const output = await decryptText(String(input).trim(), password);
    return { output };
  } catch {
    if (mode === 'encrypt') throw new Error('Encryption failed.');
    throw new Error('Decryption failed - wrong password, or the text was not encrypted with this tool.');
  }
}

export default createComputeHandler(compute);
