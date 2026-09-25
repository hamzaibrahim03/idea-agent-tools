import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function reverseChars(text) {
  return [...text].reverse().join('');
}
function reverseWords(text) {
  return text.split(/(\s+)/).reverse().join('');
}
function reverseLines(text) {
  return text.split('\n').reverse().join('\n');
}
const MODES = {
  Characters: reverseChars,
  Words: reverseWords,
  Lines: reverseLines
};
export default function TextReverser() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('Characters');
  const [copied, setCopied] = useState(false);
  const output = input ? MODES[mode](input) : '';
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
    downloadFile(output, 'reversed.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Text Reverser</h1>
      <p className="tool-description">
        Reverse text by character, word, or line. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {Object.keys(MODES).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
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
          <label htmlFor="reverse-input">Input</label>
          <textarea id="reverse-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="reverse-output">Output</label>
          <textarea id="reverse-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
