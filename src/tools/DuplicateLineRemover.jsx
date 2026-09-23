import { useMemo, useState } from 'react';
function removeDuplicates(text, options) {
  const lines = text.split('\n');
  const seen = new Set();
  const output = [];
  let removed = 0;
  for (const line of lines) {
    let key = options.trim ? line.trim() : line;
    if (options.caseInsensitive) key = key.toLowerCase();
    if (seen.has(key)) {
      removed++;
      continue;
    }
    seen.add(key);
    output.push(line);
  }
  return { lines: output, removed };
}
export default function DuplicateLineRemover() {
  const [input, setInput] = useState('');
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trim, setTrim] = useState(false);
  const [copied, setCopied] = useState(false);
  const { lines, removed } = useMemo(
    () => removeDuplicates(input, { caseInsensitive, trim }),
    [input, caseInsensitive, trim]
  );
  const output = lines.join('\n');
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Duplicate Line Remover</h1>
      <p className="tool-description">
        Paste multi-line text and remove duplicate lines, keeping the first occurrence of each. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={caseInsensitive} onChange={() => setCaseInsensitive((v) => !v)} />
          Case-insensitive
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={trim} onChange={() => setTrim((v) => !v)} />
          Trim whitespace before comparing
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="dedupe-input">Input</label>
          <textarea id="dedupe-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="dedupe-output">Output ({removed} duplicate{removed === 1 ? '' : 's'} removed)</label>
          <textarea id="dedupe-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
