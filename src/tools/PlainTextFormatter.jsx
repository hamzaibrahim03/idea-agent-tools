import { useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function cleanText(text) {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((para) =>
      para
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(' ')
        .replace(/[ \t]+/g, ' ')
        .trim()
    )
    .filter((para) => para.length > 0);
  return paragraphs.join('\n\n');
}
export default function PlainTextFormatter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = input ? cleanText(input) : '';
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
    downloadFile(output, 'cleaned-text.txt', 'text/plain');
  }
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
  return (
    <div className="tool-page">
      <h1>Plain Text Formatter</h1>
      <p className="tool-description">
        Paste text with messy line breaks and spacing - like text copied from a PDF with awkward
        line wraps - and clean it up: hard line breaks within a paragraph are removed while
        paragraph breaks (blank lines) are preserved, and extra whitespace is normalized. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>{copied ? 'Copied!' : 'Copy cleaned text'}</button>
        <button onClick={handleDownload} disabled={!output}>Download</button>
        <button onClick={() => setInput('')} disabled={!input}>Clear</button>
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
          <label htmlFor="ptf-input">Input (messy text)</label>
          <textarea
            id="ptf-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text with odd line wraps here"
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="ptf-output">Output (cleaned)</label>
          <textarea id="ptf-output" value={output} readOnly spellCheck={false} placeholder="Cleaned text will appear here" />
        </div>
      </div>
    </div>
  );
}
