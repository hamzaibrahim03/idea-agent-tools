import { useMemo, useState } from 'react';
function generateNames(keyword) {
  const k = keyword.trim();
  if (!k) return [];
  const capitalized = k.charAt(0).toUpperCase() + k.slice(1);
  return [
    `Ultra ${capitalized}`,
    `${capitalized} Pro`,
    `The ${capitalized} Co.`,
    `${capitalized} Plus`,
    `Prime ${capitalized}`,
    `${capitalized} Essentials`,
    `${capitalized} Studio`,
    `Nova ${capitalized}`,
    `${capitalized} Collective`,
    `Pure ${capitalized}`
  ];
}
export default function ProductNameGenerator() {
  const [keyword, setKeyword] = useState('');
  const [copied, setCopied] = useState('');
  const names = useMemo(() => generateNames(keyword), [keyword]);
  async function handleCopy(name) {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      setTimeout(() => setCopied(''), 1200);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Product Name Generator</h1>
      <p className="tool-description">
        Enter a keyword or category to get product name ideas combined with a curated list of
        adjectives and patterns (e.g. "Ultra [Keyword]", "[Keyword] Pro"). These are pattern-based
        suggestions, not AI-generated or trademark-checked - verify availability and trademark
        status separately before using any name. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="pn-keyword">Keyword / category</label>
        <input
          id="pn-keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. backpack"
        />
      </div>
      {names.length > 0 ? (
        <ul className="uuid-list">
          {names.map((name) => (
            <li key={name}>
              <span>{name}</span>
              <button className="uuid-copy-btn" onClick={() => handleCopy(name)}>
                {copied === name ? 'Copied!' : 'Copy'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tool-placeholder">Enter a keyword to generate name ideas.</p>
      )}
    </div>
  );
}
