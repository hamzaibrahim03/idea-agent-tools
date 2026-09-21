import { useState } from 'react';
function slugify(text, separator) {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');
}
export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [copied, setCopied] = useState(false);
  const slug = input ? slugify(input, separator) : '';
  async function handleCopy() {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Slug Generator</h1>
      <p className="tool-description">
        Convert text into a clean, URL-safe slug - lowercased, accents stripped, and non-alphanumeric
        characters replaced with a separator. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Separator:
          <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </label>
        <button onClick={handleCopy} disabled={!slug}>
          {copied ? 'Copied!' : 'Copy slug'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="slug-input">Text</label>
        <input
          id="slug-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. My Awesome Blog Post!"
        />
      </div>
      <div className="tool-panel">
        <label htmlFor="slug-output">Slug</label>
        <input id="slug-output" type="text" value={slug} readOnly style={{ fontFamily: 'var(--mono)' }} />
      </div>
    </div>
  );
}
