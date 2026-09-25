import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
const SALT_BYTES = 16;
const IV_BYTES = 12;
const PBKDF2_ITERATIONS = 100000;
async function deriveKey(password, salt) {
  const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
function bytesToBase64(bytes) {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
function base64ToBytes(base64) {
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}
async function encryptText(plaintext, password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
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
  const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(plainBuffer);
}
export default function TextEncryption() {
  const [mode, setMode] = useState('encrypt');
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  async function handleRun() {
    setError('');
    setOutput('');
    if (!input.trim() || !password) return;
    try {
      const result = mode === 'encrypt' ? await encryptText(input, password) : await decryptText(input.trim(), password);
      setOutput(result);
    } catch {
      setError(mode === 'encrypt' ? 'Encryption failed.' : 'Decryption failed - wrong password, or the text was not encrypted with this tool.');
    }
  }
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(output, mode === 'encrypt' ? 'encrypted.txt' : 'decrypted.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Text Encryption (AES-256)</h1>
      <p className="tool-description">
        Encrypt or decrypt text with a password, using AES-256-GCM via your browser's built-in Web
        Crypto API. Runs entirely in your browser - nothing is sent anywhere. You'll need the same
        password to decrypt later; there's no way to recover the text without it.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => { setMode(e.target.value); setOutput(''); setError(''); }}>
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '160px' }} />
        </label>
        <button onClick={handleRun} disabled={!input.trim() || !password}>
          {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="encrypt-input">{mode === 'encrypt' ? 'Text to encrypt' : 'Encrypted text (base64)'}</label>
        <textarea id="encrypt-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {output && (
        <div className="tool-panel">
          <label htmlFor="encrypt-output">
            {mode === 'encrypt' ? 'Encrypted (base64)' : 'Decrypted text'}
          </label>
          <div className="tool-controls">
            <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
            <button onClick={handleDownload}>Download</button>
          </div>
          <textarea id="encrypt-output" value={output} readOnly spellCheck={false} />
        </div>
      )}
    </div>
  );
}
