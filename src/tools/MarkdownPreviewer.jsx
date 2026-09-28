import { useState, useRef } from 'react';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function renderMarkdown(md) {
  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const withInline = (line) =>
    escapeHtml(line)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  const lines = md.split('\n');
  const html = [];
  let inList = false;
  let inCode = false;
  for (const raw of lines) {
    if (raw.trim().startsWith('```')) {
      inCode = !inCode;
      html.push(inCode ? '<pre><code>' : '</code></pre>');
      continue;
    }
    if (inCode) {
      html.push(escapeHtml(raw));
      continue;
    }
    const heading = raw.match(/^(#{1,6})\s+(.*)$/);
    const listItem = raw.match(/^[-*]\s+(.*)$/);
    const quote = raw.match(/^>\s?(.*)$/);
    if (listItem) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${withInline(listItem[1])}</li>`);
      continue;
    }
    if (inList) { html.push('</ul>'); inList = false; }
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${withInline(heading[2])}</h${level}>`);
    } else if (quote) {
      html.push(`<blockquote>${withInline(quote[1])}</blockquote>`);
    } else if (raw.trim() === '') {
      html.push('');
    } else {
      html.push(`<p>${withInline(raw)}</p>`);
    }
  }
  if (inList) html.push('</ul>');
  return html.join('\n');
}
export default function MarkdownPreviewer() {
  const [input, setInput] = useState('# Hello\n\nType some **Markdown** here.');
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  function handleUploadClick() {
    fileInputRef.current?.click();
  }
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setInput(await readFileAsText(file));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    }
  }
  async function handleLoadFromUrl() {
    const url = window.prompt('Enter a URL to load Markdown from:');
    if (!url) return;
    try {
      setInput(await loadTextFromUrl(url));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    }
  }
  return (
    <div className="tool-page">
      <h1>Markdown Previewer</h1>
      <p className="tool-description">
        Write Markdown and see the rendered HTML preview side by side. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={handleUploadClick}>
          Upload file
        </button>
        <button type="button" onClick={handleLoadFromUrl}>
          Load from URL
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".md,text/markdown,text/*"
          style={{ display: 'none' }}
        />
      </div>
      {loadError && (
        <div className="tool-error">
          <strong>Load error:</strong> {loadError}
        </div>
      )}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="md-input">Markdown</label>
          <textarea id="md-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label>Preview</label>
          <div
            className="regex-highlighted"
            style={{ minHeight: 260 }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(input) }}
          />
        </div>
      </div>
    </div>
  );
}
