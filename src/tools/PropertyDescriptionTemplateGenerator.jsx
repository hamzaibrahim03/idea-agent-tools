import { useState } from 'react';
export default function PropertyDescriptionTemplateGenerator() {
  const [propertyType, setPropertyType] = useState('House');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [sqft, setSqft] = useState('1800');
  const [location, setLocation] = useState('');
  const [features, setFeatures] = useState('');
  const [copied, setCopied] = useState(false);
  const featureList = features
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);
  function buildDescription() {
    const loc = location || '[Location]';
    const typeLower = propertyType.toLowerCase();
    const intro = `This ${bedrooms}-bedroom, ${bathrooms}-bathroom ${typeLower} offers ${sqft || '[square footage]'} sq ft of living space in ${loc}.`;
    const featuresBlock = featureList.length
      ? `Key features include:\n${featureList.map((f) => `- ${f}`).join('\n')}`
      : '';
    const closing = `Don't miss this opportunity to own a ${typeLower} in ${loc}. Contact us today to schedule a viewing.`;
    return [intro, '', featuresBlock, '', closing].filter((line, i, arr) => !(line === '' && arr[i - 1] === '')).join('\n').trim();
  }
  const description = buildDescription();
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
        Fill in the property details below and this tool assembles a structured listing
        description from a fill-in-the-blank template. It is not AI-written copy - it's a
        mechanical template you should review and personalize before publishing. Runs entirely in
        your browser.
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
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy description'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated description</label>
        <textarea readOnly value={description} style={{ minHeight: 220 }} />
      </div>
    </div>
  );
}
