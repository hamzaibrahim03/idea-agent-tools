import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  let formatted = '';
  let error = '';
  if (input.trim()) {
    try {
      formatted = JSON.stringify(JSON.parse(input), null, indent);
    } catch (e) {
      error = e.message;
    }
  }
  function handleMinify() {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {
    }
  }
  async function handleCopy() {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(formatted, 'formatted.json', 'application/json');
  }
  return (
    <div className="tool-page">
      <h1>JSON Formatter &amp; Validator</h1>
      <p className="tool-description">
        Paste JSON to format, validate, and minify it. Runs entirely in your browser - nothing is
        sent to a server.
      </p>
      <div className="tool-controls">
        <label>
          Indent:
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Tab</option>
          </select>
        </label>
        <button onClick={handleMinify} disabled={!input.trim()}>
          Minify
        </button>
        <button onClick={handleCopy} disabled={!formatted}>
          {copied ? 'Copied!' : 'Copy formatted'}
        </button>
        <button onClick={handleDownload} disabled={!formatted}>
          Download
        </button>
        <button onClick={() => setInput('')} disabled={!input}>
          Clear
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="json-input">Input</label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"example": "paste your JSON here"}'
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="json-output">
            Output {error && <span className="tool-error-inline">Invalid JSON</span>}
          </label>
          <textarea id="json-output" value={formatted} readOnly spellCheck={false} placeholder="Formatted JSON will appear here" />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Parse error:</strong> {error}
        </div>
      )}
    </div>
  );
}
