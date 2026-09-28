import { useMemo, useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function truncateByChars(text, limit, suffix) {
  if (text.length <= limit) return text;
  const cut = Math.max(0, limit - suffix.length);
  return text.slice(0, cut).trimEnd() + suffix;
}
function truncateByWords(text, limit, suffix) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(' ') + suffix;
}
export default function TextTruncator() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('chars');
  const [limit, setLimit] = useState(150);
  const [suffix, setSuffix] = useState('…');
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const safeLimit = Math.max(1, Number(limit) || 1);
  const output = useMemo(() => {
    if (!input) return '';
    return mode === 'words'
      ? truncateByWords(input, safeLimit, suffix)
      : truncateByChars(input, safeLimit, suffix);
  }, [input, mode, safeLimit, suffix]);
  const wasTruncated = output !== input;
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
    downloadFile(output, 'truncated.txt', 'text/plain');
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
      <h1>Text Truncator</h1>
      <p className="tool-description">
        Paste text and truncate it to a configurable character or word limit with a custom
        ellipsis suffix - handy for meta descriptions, tweet previews, and card summaries. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Limit by:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="chars">Characters</option>
            <option value="words">Words</option>
          </select>
        </label>
        <label>
          Limit:
          <input
            type="number"
            min={1}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            style={{ width: '80px' }}
          />
        </label>
        <label>
          Suffix:
          <input
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            style={{ width: '80px' }}
          />
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
      <div className="tool-panel">
        <label htmlFor="trunc-input">Input</label>
        <textarea id="trunc-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste text here" />
      </div>
      <div className="tool-panel">
        <label htmlFor="trunc-output">
          Truncated output {wasTruncated && output ? '(truncated)' : ''}
        </label>
        <textarea id="trunc-output" value={output} readOnly spellCheck={false} />
      </div>
      <div className="timestamp-result">
        <span><strong>Before:</strong> {input.length} characters</span>
        <span><strong>After:</strong> {output.length} characters</span>
      </div>
    </div>
  );
}
