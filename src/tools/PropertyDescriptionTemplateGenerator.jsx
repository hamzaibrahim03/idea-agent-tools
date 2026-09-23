import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function PropertyDescriptionTemplateGenerator() {
  const [propertyType, setPropertyType] = useState('House');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [sqft, setSqft] = useState('1800');
  const [location, setLocation] = useState('');
  const [features, setFeatures] = useState('');
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('property-description-template', 'Property Description Generator');
  const result = ai.result;
  const description = result?.fullDescription || '';
  async function handleGenerate() {
    await ai.generate({ propertyType, bedrooms, bathrooms, sqft, location, features });
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Property Description Template Generator</h1>
      <p className="tool-description">
        Fill in the property details below and click "Generate with AI" for a genuinely AI-written
        listing description - free, no account needed (rate-limited to keep it free for everyone).
        Review and personalize the result before publishing.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pd-type">Property type</label>
          <select id="pd-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option>House</option>
            <option>Apartment</option>
            <option>Condo</option>
            <option>Townhouse</option>
            <option>Villa</option>
            <option>Studio</option>
          </select>
        </div>
        <div className="tool-panel">
          <label htmlFor="pd-location">Location</label>
          <input id="pd-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Maple Street, Springfield" />
        </div>
        <div className="tool-panel">
          <label htmlFor="pd-bed">Bedrooms</label>
          <input id="pd-bed" type="number" min={0} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pd-bath">Bathrooms</label>
          <input id="pd-bath" type="number" min={0} value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pd-sqft">Square footage</label>
          <input id="pd-sqft" type="number" min={0} value={sqft} onChange={(e) => setSqft(e.target.value)} />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="pd-features">Key features (one per line)</label>
        <textarea
          id="pd-features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder={'Updated kitchen with granite countertops\nHardwood floors throughout\nFenced backyard\nAttached 2-car garage'}
          style={{ minHeight: 110 }}
        />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !location.trim()}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button type="button" onClick={handleCopy} disabled={!description}>
          {copied ? 'Copied!' : 'Copy description'}
        </button>
        <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
          {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
        </button>
      </div>
      {ai.showApiSetup && (
        <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
      )}
      {ai.error && <div className="agent-error">{ai.error}</div>}
      {result?.headline && (
        <div className="tool-panel">
          <label>Headline</label>
          <input readOnly value={result.headline} />
        </div>
      )}
      <div className="tool-panel">
        <label>Generated description</label>
        <textarea readOnly value={description} placeholder="Fill in the details above and click Generate with AI" style={{ minHeight: 220 }} />
      </div>
      {result?.highlights?.length > 0 && (
        <ul className="uuid-list">
          {result.highlights.map((h, i) => (
            <li key={i}>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
