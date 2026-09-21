import { useState } from 'react';
const QUADRANTS = [
  { key: 'strengths', title: 'Strengths', hint: 'Internal advantages you already have' },
  { key: 'weaknesses', title: 'Weaknesses', hint: 'Internal areas that need improvement' },
  { key: 'opportunities', title: 'Opportunities', hint: 'External factors you could take advantage of' },
  { key: 'threats', title: 'Threats', hint: 'External factors that could cause problems' }
];
export default function SwotAnalysisBuilder() {
  const [items, setItems] = useState({ strengths: [''], weaknesses: [''], opportunities: [''], threats: [''] });
  function updateItem(key, index, value) {
    setItems((prev) => ({ ...prev, [key]: prev[key].map((v, i) => (i === index ? value : v)) }));
  }
  function addItem(key) {
    setItems((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
  }
  function removeItem(key, index) {
    setItems((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  }
  return (
    <div className="tool-page">
      <h1>SWOT Analysis Builder</h1>
      <p className="tool-description">
        Fill in Strengths, Weaknesses, Opportunities, and Threats to build a structured 2x2 SWOT
        grid. A plain form-based template for organizing your own thinking - it does not generate
        any analysis content for you. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        {QUADRANTS.map((q) => (
          <div key={q.key} className="tool-panel">
            <label>
              {q.title} <span style={{ fontWeight: 400, opacity: 0.65 }}>— {q.hint}</span>
            </label>
            {items[q.key].map((val, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => updateItem(q.key, i, e.target.value)}
                  placeholder={`Add a ${q.title.toLowerCase().slice(0, -1)}...`}
                  style={{ flex: 1 }}
                />
                <button type="button" className="uuid-copy-btn" onClick={() => removeItem(q.key, i)} disabled={items[q.key].length <= 1}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addItem(q.key)} style={{ alignSelf: 'flex-start' }}>
              Add {q.title.slice(0, -1)}
            </button>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: '18px', marginTop: '8px' }}>Summary</h2>
      <div className="tool-grid">
        {QUADRANTS.map((q) => (
          <div key={q.key} className="timestamp-result">
            <strong>{q.title}</strong>
            {items[q.key].filter((v) => v.trim()).length === 0 && <div style={{ opacity: 0.6 }}>No items added yet.</div>}
            {items[q.key]
              .filter((v) => v.trim())
              .map((v, i) => (
                <div key={i}>• {v}</div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
