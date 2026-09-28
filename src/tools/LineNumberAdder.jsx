import { useMemo, useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function addLineNumbers(text, start, padWidth, separator) {
  if (!text) return '';
  const lines = text.split('\n');
  const maxNumber = start + lines.length - 1;
  const width = Math.max(padWidth, String(maxNumber).length);
  return lines
    .map((line, idx) => `${String(start + idx).padStart(width, '0')}${separator}${line}`)
    .join('\n');
}
export default function LineNumberAdder() {
  const [input, setInput] = useState('');
  const [start, setStart] = useState(1);
  const [padWidth, setPadWidth] = useState(1);
  const [separator, setSeparator] = useState(': ');
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const output = useMemo(
    () => addLineNumbers(input, Math.max(0, Number(start) || 0), Math.max(1, Number(padWidth) || 1), separator),
    [input, start, padWidth, separator]
  );
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
    downloadFile(output, 'numbered-lines.txt', 'text/plain');
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
      <h1>Line Number Adder</h1>
      <p className="tool-description">
        Paste text and prepend a line number to every line, with a configurable starting number,
        zero-padding width, and separator. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Start at:
          <input
            type="number"
            min={0}
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <label>
          Min digits:
          <input
            type="number"
            min={1}
            max={10}
            value={padWidth}
            onChange={(e) => setPadWidth(e.target.value)}
            style={{ width: '60px' }}
          />
        </label>
        <label>
          Separator:
          <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value=": ">Colon (": ")</option>
            <option value=". ">Period (". ")</option>
            <option value=") ">Paren (") ")</option>
            <option value="\t">Tab</option>
            <option value=" ">Space</option>
          </select>
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
          <label htmlFor="ln-input">Input</label>
          <textarea id="ln-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste text here" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ln-output">Numbered output</label>
          <textarea id="ln-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
