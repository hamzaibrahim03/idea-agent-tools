import { useState } from 'react';
function formatApa({ author, title, year, publisher, url }) {
  const parts = [];
  if (author) parts.push(`${author}.`);
  parts.push(`(${year || 'n.d.'}).`);
  if (title) parts.push(`${title}.`);
  if (publisher) parts.push(`${publisher}.`);
  if (url) parts.push(url);
  return parts.filter(Boolean).join(' ');
}
function formatMla({ author, title, year, publisher, url }) {
  const parts = [];
  if (author) parts.push(`${author}.`);
  if (title) parts.push(`"${title}."`);
  const tail = [publisher, year].filter(Boolean).join(', ');
  if (tail) parts.push(`${tail}.`);
  if (url) parts.push(`${url}.`);
  return parts.filter(Boolean).join(' ');
}
function formatChicago({ author, title, year, publisher, url }) {
  const parts = [];
  if (author) parts.push(`${author}.`);
  if (title) parts.push(`${title}.`);
  const tail = [publisher, year].filter(Boolean).join(', ');
  if (tail) parts.push(`${tail}.`);
  if (url) parts.push(`${url}.`);
  return parts.filter(Boolean).join(' ');
}
export default function CitationGenerator() {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(null);
  const source = { author, title, year, publisher, url };
  const apa = formatApa(source);
  const mla = formatMla(source);
  const chicago = formatChicago(source);
  async function copyText(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Citation Generator</h1>
      <p className="tool-description">
        Enter your source details to generate a citation formatted using the standard APA, MLA, and
        Chicago style rules. Double-check against your institution's style guide for edge cases
        (multiple authors, no author, etc.) not covered by this simplified form. Runs entirely in
        your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="cit-author">Author (Last, First)</label>
          <input id="cit-author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Smith, Jane" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cit-title">Title</label>
          <input id="cit-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Article Title" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cit-year">Year</label>
          <input id="cit-year" type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cit-publisher">Publisher / Website</label>
          <input id="cit-publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Example Press" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cit-url">URL (optional)</label>
          <input id="cit-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/article" />
        </div>
      </div>
      {[
        { key: 'apa', label: 'APA', text: apa },
        { key: 'mla', label: 'MLA', text: mla },
        { key: 'chicago', label: 'Chicago', text: chicago }
      ].map(({ key, label, text }) => (
        <div key={key} className="tool-panel">
          <label>{label}</label>
          <div className="timestamp-result" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{text}</span>
            <button type="button" className="uuid-copy-btn" onClick={() => copyText(text, key)}>
              {copied === key ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
