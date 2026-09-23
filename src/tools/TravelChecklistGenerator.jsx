import { useEffect, useState } from 'react';
export default function TravelChecklistGenerator() {
  const [destinationType, setDestinationType] = useState('international');
  const [checked, setChecked] = useState({});
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    fetch('/api/tools/travel-checklist-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { destinationType } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else {
          setError('');
          setItems(data.items);
        }
      })
      .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    return () => { cancelled = true; };
  }, [destinationType]);
  function toggle(item) {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
  }
  const checkedCount = items.filter((i) => checked[i]).length;
  return (
    <div className="tool-page">
      <h1>Travel Checklist Generator</h1>
      <p className="tool-description">
        Pick a destination type to get a curated pre-trip checklist - passport, visa, insurance,
        vaccinations reminder, currency, adapters - from a built-in reference list, with checkboxes.
        This is a general reminder checklist, not a lookup of your specific destination's actual
        requirements - always verify current passport/visa/vaccination rules with official sources.
        Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Destination type:
          <select value={destinationType} onChange={(e) => setDestinationType(e.target.value)}>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label>
          Pre-trip checklist ({checkedCount}/{items.length} done)
        </label>
        {items.map((item) => (
          <label key={item} className="checkbox-label" style={{ padding: '4px 0' }}>
            <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} />
            <span style={{ textDecoration: checked[item] ? 'line-through' : 'none', opacity: checked[item] ? 0.5 : 1 }}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
