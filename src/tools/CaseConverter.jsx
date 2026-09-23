import { useState } from 'react';
function toWords(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}
const CONVERTERS = {
  camelCase: (words) =>
    words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join(''),
  PascalCase: (words) => words.map((w) => w[0].toUpperCase() + w.slice(1)).join(''),
  snake_case: (words) => words.join('_'),
  'kebab-case': (words) => words.join('-'),
  CONSTANT_CASE: (words) => words.join('_').toUpperCase()
};
export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const words = toWords(input);
  const results = Object.entries(CONVERTERS).map(([label, fn]) => [label, words.length ? fn(words) : '']);
  async function copy(label, value) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(label);
      setTimeout(() => setCopiedKey(''), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Text Case Converter</h1>
      <p className="tool-description">
        Convert text between camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.
        Looking for prose-style title casing (with AP/Chicago minor-word rules)? See the{' '}
        <a href="/tools/title-case-converter">Title Case Converter</a>. Runs entirely in your
        browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="case-input">Input</label>
        <input
          id="case-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. my_variable-Name here"
        />
      </div>
      <ul className="uuid-list">
        {results.map(([label, value]) => (
          <li key={label}>
            <code>{value || '—'}</code>
            <button className="uuid-copy-btn" onClick={() => copy(label, value)} disabled={!value}>
              {copiedKey === label ? 'Copied!' : `Copy ${label}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
