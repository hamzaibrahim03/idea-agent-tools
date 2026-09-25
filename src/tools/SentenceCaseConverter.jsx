import { useMemo, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function toSentenceCase(text) {
  if (!text) return '';
  const lowered = text.toLowerCase();
  const segments = lowered.match(/[^.!?]*[.!?]+|[^.!?]+$/g) || [];
  return segments
    .map((segment) => {
      const match = segment.match(/[a-z0-9]/i);
      if (!match) return segment;
      const idx = segment.indexOf(match[0]);
      return segment.slice(0, idx) + segment[idx].toUpperCase() + segment.slice(idx + 1);
    })
    .join('');
}
export default function SentenceCaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => toSentenceCase(input), [input]);
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
    downloadFile(output, 'sentence-case.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Sentence Case Converter</h1>
      <p className="tool-description">
        Convert text so each sentence starts with a capital letter and the rest is lowercase,
        splitting on ".", "!", and "?" boundaries. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="sc-input">Input</label>
          <textarea id="sc-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="type text however YOU want. it will be fixed." />
        </div>
        <div className="tool-panel">
          <label htmlFor="sc-output">Sentence case output</label>
          <textarea id="sc-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
