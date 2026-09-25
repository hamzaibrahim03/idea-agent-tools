import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function encodeEntities(text) {
  return text.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}
function decodeEntities(text) {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}
export default function HtmlEntityTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encode');
  const [copied, setCopied] = useState(false);
  const output = input ? (mode === 'encode' ? encodeEntities(input) : decodeEntities(input)) : '';
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
    downloadFile(output, 'html-entities.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>HTML Entity Encoder / Decoder</h1>
      <p className="tool-description">
        Encode special characters (&amp;, &lt;, &gt;, quotes) to HTML entities, or decode HTML
        entities back to plain text. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
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
          <label htmlFor="entity-input">Input</label>
          <textarea
            id="entity-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '<div class="a">Tom & Jerry</div>' : '&lt;div&gt;Tom &amp;amp; Jerry&lt;/div&gt;'}
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="entity-output">Output</label>
          <textarea id="entity-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
