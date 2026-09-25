import { useMemo, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function naturalCompare(a, b) {
  const chunk = /(\d+)|(\D+)/g;
  const aParts = a.match(chunk) || [];
  const bParts = b.match(chunk) || [];
  const len = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < len; i++) {
    const ap = aParts[i] ?? '';
    const bp = bParts[i] ?? '';
    const aNum = /^\d+$/.test(ap);
    const bNum = /^\d+$/.test(bp);
    if (aNum && bNum) {
      const diff = Number(ap) - Number(bp);
      if (diff !== 0) return diff;
    } else if (ap !== bp) {
      return ap < bp ? -1 : 1;
    }
  }
  return 0;
}
function sortLines(text, options) {
  let lines = text.split('\n');
  if (options.dedupe) {
    const seen = new Set();
    lines = lines.filter((line) => {
      const key = options.caseInsensitive ? line.toLowerCase() : line;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  const compare = (a, b) => {
    const aKey = options.caseInsensitive ? a.toLowerCase() : a;
    const bKey = options.caseInsensitive ? b.toLowerCase() : b;
    if (options.natural) return naturalCompare(aKey, bKey);
    if (aKey < bKey) return -1;
    if (aKey > bKey) return 1;
    return 0;
  };
  lines = [...lines].sort(compare);
  if (options.direction === 'desc') lines.reverse();
  return lines;
}
export default function TextSorter() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState('asc');
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [dedupe, setDedupe] = useState(false);
  const [natural, setNatural] = useState(false);
  const [copied, setCopied] = useState(false);
  const output = useMemo(
    () => sortLines(input, { direction, caseInsensitive, dedupe, natural }).join('\n'),
    [input, direction, caseInsensitive, dedupe, natural]
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
    downloadFile(output, 'sorted.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Text Sorter</h1>
      <p className="tool-description">
        Paste multi-line text and sort the lines alphabetically, with optional case-insensitive,
        duplicate-removal, and natural (numeric-aware) sorting. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Direction:
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={caseInsensitive} onChange={() => setCaseInsensitive((v) => !v)} />
          Case-insensitive
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={dedupe} onChange={() => setDedupe((v) => !v)} />
          Remove duplicate lines
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={natural} onChange={() => setNatural((v) => !v)} />
          Natural sort (item2 before item10)
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
          <label htmlFor="sort-input">Input</label>
          <textarea id="sort-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="sort-output">Sorted output</label>
          <textarea id="sort-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
