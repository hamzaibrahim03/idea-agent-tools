import { useEffect, useState } from 'react';
const TRIP_TYPE_LABELS = {
  beach: 'Beach',
  business: 'Business',
  camping: 'Camping',
  winter: 'Winter',
  general: 'General'
};
export default function PackingListGenerator() {
  const [tripType, setTripType] = useState('beach');
  const [days, setDays] = useState(5);
  const [checked, setChecked] = useState({});
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/packing-list-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { tripType, days } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setItems(data.items || []);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [tripType, days]);
  function toggle(item) {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
  }
  const checkedCount = items.filter((i) => checked[i]).length;
  return (
    <div className="tool-page">
      <h1>Packing List Generator</h1>
      <p className="tool-description">
        Pick a trip type and length to get a curated packing checklist from a built-in reference
        list, with checkboxes to track what you've packed. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Trip type:
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            {Object.entries(TRIP_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          Trip length (days):
          <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} style={{ width: '70px' }} />
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && (
        <div className="tool-panel">
          <label>
            Packing checklist ({checkedCount}/{items.length} packed)
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
      )}
    </div>
  );
}
