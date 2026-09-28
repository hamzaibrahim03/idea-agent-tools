import { useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function cleanText(text, options) {
  let result = text;
  if (options.trimLines) {
    result = result
      .split('\n')
      .map((l) => l.trim())
      .join('\n');
  }
  if (options.collapseSpaces) {
    result = result.replace(/[ \t]+/g, ' ');
  }
  if (options.collapseBlankLines) {
    result = result.replace(/\n{3,}/g, '\n\n');
  }
  if (options.removeBlankLines) {
    result = result
      .split('\n')
      .filter((l) => l.trim() !== '')
      .join('\n');
  }
  if (options.trimWhole) {
    result = result.trim();
  }
  return result;
}
export default function WhitespaceCleaner() {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState({
    trimLines: true,
    collapseSpaces: true,
    collapseBlankLines: true,
    removeBlankLines: false,
    trimWhole: true
  });
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = cleanText(input, options);
  function toggle(key) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
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
    downloadFile(output, 'cleaned.txt', 'text/plain');
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
      <h1>Whitespace / Text Cleaner</h1>
      <p className="tool-description">
        Remove extra spaces, trim lines, and collapse blank lines. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={options.trimLines} onChange={() => toggle('trimLines')} />
          Trim each line
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={options.collapseSpaces} onChange={() => toggle('collapseSpaces')} />
          Collapse repeated spaces
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={options.collapseBlankLines} onChange={() => toggle('collapseBlankLines')} />
          Collapse blank lines
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={options.removeBlankLines} onChange={() => toggle('removeBlankLines')} />
          Remove blank lines entirely
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={options.trimWhole} onChange={() => toggle('trimWhole')} />
          Trim start/end
        </label>
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
          <label htmlFor="clean-input">Input</label>
          <textarea id="clean-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="clean-output">Output</label>
          <textarea id="clean-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
