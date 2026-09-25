import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function ProductDescriptionTemplateGenerator() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [audience, setAudience] = useState('');
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('product-description-template', 'Product Description Generator');
  const result = ai.result;
  const output = result?.fullDescription || '';
  async function handleGenerate() {
    await ai.generate({ name, category, features, audience });
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(output, 'product-description.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Product Description Template Generator</h1>
      <p className="tool-description">
        Fill in your product name, category, key features, and target audience, then click "Generate
        with AI" for a genuinely AI-written, benefit-driven product description - free, no account
        needed (rate-limited to keep it free for everyone). Review and edit before publishing.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pd-name">Product name</label>
          <input id="pd-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AquaFlow Water Bottle" />
        </div>
        <div className="tool-panel">
          <label htmlFor="pd-category">Category</label>
          <input id="pd-category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. insulated water bottle" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="pd-audience">Target audience</label>
        <input id="pd-audience" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. outdoor enthusiasts" />
      </div>
      <div className="tool-panel">
        <label htmlFor="pd-features">Key features (one per line)</label>
        <textarea
          id="pd-features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder={'24-hour cold retention\nLeak-proof lid\nBPA-free materials'}
          style={{ minHeight: 120 }}
        />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !name.trim()}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button type="button" onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy description'}
        </button>
        <button type="button" onClick={handleDownload} disabled={!output}>
          Download
        </button>
        <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
          {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
        </button>
      </div>
      {ai.showApiSetup && (
        <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
      )}
      {ai.error && <div className="agent-error">{ai.error}</div>}
      {result?.shortDescription && (
        <div className="tool-panel">
          <label>Short description</label>
          <textarea readOnly value={result.shortDescription} style={{ minHeight: 60 }} />
        </div>
      )}
      <div className="tool-panel">
        <label htmlFor="pd-output">Generated description</label>
        <textarea id="pd-output" value={output} readOnly placeholder="Fill in the fields above and click Generate with AI" style={{ minHeight: 220 }} />
      </div>
      {result?.bulletPoints?.length > 0 && (
        <ul className="uuid-list">
          {result.bulletPoints.map((b, i) => (
            <li key={i}>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
