import { useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = input ? encodeURIComponent(input) : '';
  function handleDecode() {
    if (!input) return;
    try {
      setInput(decodeURIComponent(input));
      setError('');
    } catch (e) {
      setError(e.message);
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
    downloadFile(output, 'url-encoded.txt', 'text/plain');
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
      <h1>URL Encoder / Decoder</h1>
      <p className="tool-description">
        Percent-encode text for safe use in a URL, or decode a URL-encoded string back to plain
        text. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleDecode} disabled={!input}>
          Decode in place
        </button>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy encoded'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
        </button>
        <button onClick={() => setInput('')} disabled={!input}>
          Clear
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
          <label htmlFor="url-input">Input</label>
          <textarea
            id="url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text or a URL-encoded string here"
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="url-output">Encoded output</label>
          <textarea id="url-output" value={output} readOnly spellCheck={false} placeholder="Encoded text will appear here" />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Decode error:</strong> {error}
        </div>
      )}
    </div>
  );
}
