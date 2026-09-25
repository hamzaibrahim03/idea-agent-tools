import { useMemo, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function toAlternatingCase(text, startUpper) {
  let upperNext = startUpper;
  return [...text]
    .map((ch) => {
      if (!/[a-zA-Z]/.test(ch)) return ch;
      const result = upperNext ? ch.toUpperCase() : ch.toLowerCase();
      upperNext = !upperNext;
      return result;
    })
    .join('');
}
export default function TextToUpperLowerAlternating() {
  const [input, setInput] = useState('');
  const [startUpper, setStartUpper] = useState(false);
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => toAlternatingCase(input, startUpper), [input, startUpper]);
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
    downloadFile(output, 'alternating-case.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Alternating Case Converter</h1>
      <p className="tool-description">
        Convert text to aLtErNaTiNg CaSe (aka "sPoNgEbOb case") by flipping upper/lower case for
        each letter, skipping spaces and punctuation. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={startUpper} onChange={() => setStartUpper((v) => !v)} />
          Start with uppercase
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
          <label htmlFor="alt-input">Text</label>
          <textarea
            id="alt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="alt-output">Alternating case</label>
          <textarea id="alt-output" value={output} readOnly />
        </div>
      </div>
    </div>
  );
}
