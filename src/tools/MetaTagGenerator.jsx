import { useEffect, useState } from 'react';
const DESCRIPTION_LIMIT = 160;
const initialFields = {
  title: '',
  description: '',
  keywords: '',
  author: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCard: 'summary',
  canonicalUrl: '',
};
export default function MetaTagGenerator() {
  const [fields, setFields] = useState(initialFields);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [fetchError, setFetchError] = useState('');
  function updateField(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/meta-tag-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { fields } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else setOutput(data.output || '');
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [fields]);
  const descriptionTooLong = fields.description.length > DESCRIPTION_LIMIT;
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleClear() {
    setFields(initialFields);
  }
  return (
    <div className="tool-page">
      <h1>Meta Tag Generator</h1>
      <p className="tool-description">
        Fill in your page's SEO and social-sharing details to generate the matching
        &lt;meta&gt;/&lt;link&gt; tags to paste into your page's &lt;head&gt;.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy tags'}
        </button>
        <button onClick={handleClear}>Clear all</button>
      </div>
      <div className="tool-grid">
        <div>
          <div className="tool-panel">
            <label htmlFor="meta-title">
              Title {!fields.title.trim() && <span className="tool-error-inline">Recommended</span>}
            </label>
            <input
              id="meta-title"
              type="text"
              value={fields.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="My Site - Home"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor="meta-description">
              Description{' '}
              {descriptionTooLong && (
                <span className="tool-error-inline">
                  {fields.description.length}/{DESCRIPTION_LIMIT} chars - too long for SEO
                </span>
              )}
            </label>
            <input
              id="meta-description"
              type="text"
              value={fields.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="A short summary of the page, ideally under 160 characters"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor="meta-keywords">Keywords (optional)</label>
            <input
              id="meta-keywords"
              type="text"
              value={fields.keywords}
              onChange={(e) => updateField('keywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor="meta-author">Author (optional)</label>
            <input
              id="meta-author"
              type="text"
              value={fields.author}
              onChange={(e) => updateField('author', e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor="meta-canonical">Canonical URL (optional)</label>
            <input
              id="meta-canonical"
              type="text"
              value={fields.canonicalUrl}
              onChange={(e) => updateField('canonicalUrl', e.target.value)}
              placeholder="https://example.com/page"
            />
          </div>
        </div>
        <div>
          <div className="tool-panel">
            <label htmlFor="meta-og-title">Open Graph title (optional)</label>
            <input
              id="meta-og-title"
              type="text"
              value={fields.ogTitle}
              onChange={(e) => updateField('ogTitle', e.target.value)}
              placeholder="Shown when shared on social media"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor="meta-og-description">Open Graph description (optional)</label>
            <input
              id="meta-og-description"
              type="text"
              value={fields.ogDescription}
              onChange={(e) => updateField('ogDescription', e.target.value)}
              placeholder="Shown when shared on social media"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor="meta-og-image">Open Graph image URL (optional)</label>
            <input
              id="meta-og-image"
              type="text"
              value={fields.ogImage}
              onChange={(e) => updateField('ogImage', e.target.value)}
              placeholder="https://example.com/preview.png"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor="meta-twitter-card">Twitter Card type</label>
            <select
              id="meta-twitter-card"
              value={fields.twitterCard}
              onChange={(e) => updateField('twitterCard', e.target.value)}
            >
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </select>
          </div>
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="meta-output">Generated tags</label>
        <textarea
          id="meta-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Fill in fields above to generate tags"
        />
      </div>
    </div>
  );
}
