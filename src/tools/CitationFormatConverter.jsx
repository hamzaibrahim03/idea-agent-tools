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
const FORMATTERS = { apa: formatApa, mla: formatMla, chicago: formatChicago };
const LABELS = { apa: 'APA', mla: 'MLA', chicago: 'Chicago' };
export default function CitationFormatConverter() {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(null);
  const source = { author, title, year, publisher, url };
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
      <h1>Citation Format Converter</h1>
      <p className="tool-description">
        Enter a source's structured fields once (author, title, year, publisher, URL) and see it
        instantly reformatted across APA, MLA, and Chicago styles side by side, using the same
        standard formatting rules as a citation generator. Useful for converting a citation you
        already have from one style to another. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="cfc-author">Author (Last, First)</label>
          <input id="cfc-author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Smith, Jane" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cfc-title">Title</label>
          <input id="cfc-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Article Title" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cfc-year">Year</label>
          <input id="cfc-year" type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cfc-publisher">Publisher / Website</label>
          <input id="cfc-publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Example Press" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cfc-url">URL (optional)</label>
          <input id="cfc-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/article" />
        </div>
      </div>
      {Object.keys(FORMATTERS).map((key) => {
        const text = FORMATTERS[key](source);
        return (
          <div key={key} className="tool-panel">
            <label>{LABELS[key]}</label>
            <div className="timestamp-result" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{text}</span>
              <button type="button" className="uuid-copy-btn" onClick={() => copyText(text, key)}>
                {copied === key ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
