import { useEffect, useState } from 'react';
export default function MarkdownPreviewer() {
  const [input, setInput] = useState('# Hello\n\nType some **Markdown** here.');
  const [html, setHtml] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/markdown-previewer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else setHtml(data.html || '');
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  return (
    <div className="tool-page">
      <h1>Markdown Previewer</h1>
      <p className="tool-description">
        Write Markdown and see the rendered HTML preview side by side.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
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
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
