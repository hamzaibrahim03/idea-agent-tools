import { useState } from 'react';
function tokenizePath(path) {
  const trimmed = path.trim();
  if (!trimmed.startsWith('$')) {
    throw new Error('Path must start with "$".');
  }
  const rest = trimmed.slice(1);
  const tokens = [];
  const re = /\.([A-Za-z0-9_$]+)|\[(\*)\]|\['([^']*)'\]|\["([^"]*)"\]|\[(-?\d+)\]/g;
  let lastIndex = 0;
  let match;
  while ((match = re.exec(rest)) !== null) {
    if (match.index !== lastIndex) {
      throw new Error(`Unrecognized path syntax near "${rest.slice(lastIndex)}".`);
    }
    if (match[1] !== undefined) tokens.push({ type: 'key', value: match[1] });
    else if (match[2] !== undefined) tokens.push({ type: 'wildcard' });
    else if (match[3] !== undefined) tokens.push({ type: 'key', value: match[3] });
    else if (match[4] !== undefined) tokens.push({ type: 'key', value: match[4] });
    else if (match[5] !== undefined) tokens.push({ type: 'index', value: Number(match[5]) });
    lastIndex = re.lastIndex;
  }
  if (lastIndex !== rest.length) {
    throw new Error(`Unrecognized path syntax near "${rest.slice(lastIndex)}".`);
  }
  return tokens;
}
function evaluatePath(data, tokens) {
  let current = [data];
  for (const token of tokens) {
    const next = [];
    for (const value of current) {
      if (value === null || value === undefined) continue;
      if (token.type === 'key') {
        if (typeof value === 'object' && token.value in value) next.push(value[token.value]);
      } else if (token.type === 'index') {
        if (Array.isArray(value)) {
          const idx = token.value < 0 ? value.length + token.value : token.value;
          if (idx >= 0 && idx < value.length) next.push(value[idx]);
        }
      } else if (token.type === 'wildcard') {
        if (Array.isArray(value)) next.push(...value);
        else if (typeof value === 'object') next.push(...Object.values(value));
      }
    }
    current = next;
  }
  return current;
}
export default function JsonPathTester() {
  const [jsonInput, setJsonInput] = useState('{\n  "store": {\n    "book": [\n      { "title": "Book One", "price": 10 },\n      { "title": "Book Two", "price": 15 }\n    ]\n  }\n}');
  const [path, setPath] = useState('$.store.book[0].title');
  const [copied, setCopied] = useState(false);
  const result = (() => {
    let data;
    try {
      data = JSON.parse(jsonInput);
    } catch {
      return { error: 'Invalid JSON input.' };
    }
    if (!path.trim()) return { matches: [] };
    try {
      const tokens = tokenizePath(path);
      const matches = evaluatePath(data, tokens);
      return { matches };
    } catch (e) {
      return { error: e.message };
    }
  })();
  const outputText = result.matches
    ? JSON.stringify(result.matches.length === 1 ? result.matches[0] : result.matches, null, 2)
    : '';
  async function handleCopy() {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>JSONPath Tester</h1>
      <p className="tool-description">
        Paste JSON and a JSONPath-like expression to find matching values. Supports a common
        subset - dot notation, bracket notation, array indices, and wildcards - not the full
        JSONPath spec. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="jsonpath-expr">Path expression</label>
        <input
          id="jsonpath-expr"
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.store.book[0].title"
          spellCheck={false}
          style={{ fontFamily: 'var(--mono)' }}
        />
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="jsonpath-input">JSON</label>
          <textarea
            id="jsonpath-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="jsonpath-output">
            Matches {result.matches ? `(${result.matches.length})` : ''}
          </label>
          <textarea id="jsonpath-output" value={outputText} readOnly spellCheck={false} placeholder="No matches" />
        </div>
      </div>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!outputText}>
          {copied ? 'Copied!' : 'Copy matches'}
        </button>
      </div>
      {result.error && (
        <div className="tool-error">
          <strong>Error:</strong> {result.error}
        </div>
      )}
    </div>
  );
}
