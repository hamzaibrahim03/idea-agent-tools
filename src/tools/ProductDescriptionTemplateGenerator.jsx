import { useMemo, useState } from 'react';
function toBenefitBullet(feature) {
  const f = feature.trim();
  if (!f) return '';
  return `- ${f} - so you can enjoy the benefit without the hassle.`;
}
function buildDescription({ name, category, features, audience }) {
  const n = name.trim() || '[Product Name]';
  const cat = category.trim() || '[category]';
  const aud = audience.trim() || 'anyone who wants the best';
  const bullets = features
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)
    .map(toBenefitBullet)
    .join('\n');
  return `${n}\n\nIntroducing ${n}, a ${cat} designed for ${aud}.\n\nKey features:\n${bullets || '- [Add your key features, one per line]'}\n\nWhy you'll love it:\nBuilt with ${aud} in mind, ${n} combines quality and value in one ${cat}. Order yours today.`;
}
export default function ProductDescriptionTemplateGenerator() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [audience, setAudience] = useState('');
  const [copied, setCopied] = useState(false);
  const output = useMemo(
    () => buildDescription({ name, category, features, audience }),
    [name, category, features, audience]
  );
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Product Description Template Generator</h1>
      <p className="tool-description">
        Fill in your product name, category, key features, and target audience to assemble a
        structured product description with features formatted as benefit-driven bullet points.
        This is a template generator, not AI-written copy - edit the result before publishing. Runs
        entirely in your browser.
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
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy description'}</button>
      </div>
      <div className="tool-panel">
        <label htmlFor="pd-output">Generated description</label>
        <textarea id="pd-output" value={output} readOnly style={{ minHeight: 220 }} />
      </div>
    </div>
  );
}
