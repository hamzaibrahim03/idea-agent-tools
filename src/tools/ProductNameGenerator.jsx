import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function ProductNameGenerator() {
  const [keyword, setKeyword] = useState('');
  const [copied, setCopied] = useState('');
  const ai = useAiGenerate('product-name', 'Product Name Generator');
  const names = ai.result?.names || [];
  async function handleGenerate() {
    await ai.generate({ keyword });
  }
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
        Enter a keyword or category and click "Generate with AI" for genuinely AI-generated product
        name ideas - free, no account needed (rate-limited to keep it free for everyone). These are
        not trademark-checked - verify availability and trademark status separately before using any
        name.
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
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !keyword.trim()}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
          {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
        </button>
      </div>
      {ai.showApiSetup && (
        <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
      )}
      {ai.error && <div className="agent-error">{ai.error}</div>}
      {names.length > 0 ? (
        <>
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
          {ai.result?.notes && <p className="tool-placeholder">{ai.result.notes}</p>}
        </>
      ) : (
        <p className="tool-placeholder">Enter a keyword and generate to see name ideas.</p>
      )}
    </div>
  );
}
