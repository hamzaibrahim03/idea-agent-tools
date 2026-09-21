import { useState } from 'react';
const PATTERNS = [
  (k) => `${k} Solutions`,
  (k) => `${k} Co`,
  (k) => `Prime ${k}`,
  (k) => `${k} Hub`,
  (k) => `${k} Works`,
  (k) => `${k} Collective`,
  (k) => `Next ${k}`,
  (k) => `${k} Studio`,
  (k) => `${k} Group`,
  (k) => `${k} Labs`,
  (k) => `Peak ${k}`,
  (k) => `${k} & Co.`,
  (k) => `True ${k}`,
  (k) => `${k} Partners`,
  (k) => `Bright ${k}`,
  (k) => `${k} Nation`,
  (k) => `${k} House`,
  (k) => `Modern ${k}`,
  (k) => `${k} Craft`,
  (k) => `${k} Direct`
];
function titleCase(str) {
  return str
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}
export default function BusinessNameGenerator() {
  const [keyword, setKeyword] = useState('');
  const cleanKeyword = titleCase(keyword);
  const suggestions = cleanKeyword ? PATTERNS.map((fn) => fn(cleanKeyword)) : [];
  return (
    <div className="tool-page">
      <h1>Business Name Generator</h1>
      <p className="tool-description">
        Enter a keyword or industry and get business name ideas by combining it with a curated list
        of common naming patterns and suffixes (e.g. "[Keyword] Solutions", "Prime [Keyword]"). This
        is a pattern-based suggestion tool, not an AI-generated name - and it does not check
        trademark or domain availability, so verify any name you like separately before using it.
        Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Keyword / industry:
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. Bakery" style={{ minWidth: '200px' }} />
        </label>
      </div>
      {!cleanKeyword && <p className="tool-placeholder">Enter a keyword to see name suggestions.</p>}
      {cleanKeyword && (
        <ul className="uuid-list">
          {suggestions.map((s) => (
            <li key={s}>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
