import { useMemo, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
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
      </div>
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
