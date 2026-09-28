import { useMemo, useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
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
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = useMemo(() => toSentenceCase(input), [input]);
  function handleUploadClick() {
    fileInputRef.current?.click();
  }
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setInput(await readFileAsText(file));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    }
  }
  async function handleLoadFromUrl() {
    const url = window.prompt('Enter a URL to load text from:');
    if (!url) return;
    try {
      setInput(await loadTextFromUrl(url));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
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
        <button type="button" onClick={handleUploadClick}>
          Upload file
        </button>
        <button type="button" onClick={handleLoadFromUrl}>
          Load from URL
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".txt,text/*"
          style={{ display: 'none' }}
        />
      </div>
      {loadError && (
        <div className="tool-error">
          <strong>Load error:</strong> {loadError}
        </div>
      )}
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
