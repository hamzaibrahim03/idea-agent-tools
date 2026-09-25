import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function textToBinary(text) {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes, (b) => b.toString(2).padStart(8, '0')).join(' ');
}
function textToHex(text) {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ');
}
function binaryToText(code) {
  const chunks = code.trim().split(/\s+/).filter(Boolean);
  if (chunks.some((c) => !/^[01]{1,8}$/.test(c))) {
    throw new Error('Binary input must be groups of 0s and 1s (up to 8 bits each), separated by spaces.');
  }
  const bytes = Uint8Array.from(chunks.map((c) => parseInt(c, 2)));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
function hexToText(code) {
  const chunks = code.trim().split(/\s+/).filter(Boolean);
  if (chunks.some((c) => !/^[0-9a-fA-F]{1,2}$/.test(c))) {
    throw new Error('Hex input must be one or two hex digits per byte, separated by spaces.');
  }
  const bytes = Uint8Array.from(chunks.map((c) => parseInt(c, 16)));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
export default function BinaryAsciiConverter() {
  const [mode, setMode] = useState('Binary');
  const [direction, setDirection] = useState('toCode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error = '';
  if (input) {
    try {
      if (direction === 'toCode') {
        output = mode === 'Binary' ? textToBinary(input) : textToHex(input);
      } else {
        output = mode === 'Binary' ? binaryToText(input) : hexToText(input);
      }
    } catch (e) {
      error = e.message || 'Could not decode that input.';
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
    const filename = direction === 'toCode' ? `text-to-${mode.toLowerCase()}.txt` : `${mode.toLowerCase()}-to-text.txt`;
    downloadFile(output, filename, 'text/plain');
  }
  const inputLabel = direction === 'toCode' ? 'Text' : mode === 'Binary' ? 'Binary' : 'Hex';
  const outputLabel = direction === 'toCode' ? (mode === 'Binary' ? 'Binary' : 'Hex') : 'Text';
  return (
    <div className="tool-page">
      <h1>Binary / ASCII Converter</h1>
      <p className="tool-description">
        Convert text to binary or hexadecimal byte codes and back, using UTF-8 encoding. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="Binary">Binary</option>
            <option value="Hex">Hex</option>
          </select>
        </label>
        <label>
          Direction:
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="toCode">Text → Code</option>
            <option value="toText">Code → Text</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="binary-input">{inputLabel}</label>
          <textarea
            id="binary-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={direction === 'toCode' ? 'e.g. Hi' : mode === 'Binary' ? 'e.g. 01001000 01101001' : 'e.g. 48 69'}
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="binary-output">{outputLabel}</label>
          <textarea id="binary-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
      {error && <div className="tool-error">{error}</div>}
    </div>
  );
}
