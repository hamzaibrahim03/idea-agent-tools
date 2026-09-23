import { useEffect, useState } from 'react';
const DEFAULT_CATEGORIES = [
  { name: 'Flights', amount: '' },
  { name: 'Hotels', amount: '' },
  { name: 'Food', amount: '' },
  { name: 'Activities', amount: '' },
  { name: 'Transport', amount: '' }
];
export default function TravelBudgetCalculator() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [tripDays, setTripDays] = useState('');
  const [result, setResult] = useState({ total: 0, perDay: null, days: null, breakdown: [] });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/travel-budget-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { categories, tripDays } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [categories, tripDays]);
  function updateName(index, value) {
    setCategories((cats) => cats.map((c, i) => (i === index ? { ...c, name: value } : c)));
  }
  function updateAmount(index, value) {
    setCategories((cats) => cats.map((c, i) => (i === index ? { ...c, amount: value } : c)));
  }
  function addCategory() {
    setCategories((cats) => [...cats, { name: `Category ${cats.length + 1}`, amount: '' }]);
  }
  function removeCategory(index) {
    setCategories((cats) => cats.filter((_, i) => i !== index));
  }
  const { total, perDay, days, breakdown } = result;
  return (
    <div className="tool-page">
      <h1>Travel Budget Calculator</h1>
      <p className="tool-description">
        Enter your own trip budget by category - flights, hotels, food, activities, transport, or
        any categories you add - to see your total trip budget and a percentage breakdown. All
        amounts are figures you enter yourself. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button onClick={addCategory}>Add category</button>
        <label>
          Trip length (days, optional):
          <input
            type="number"
            min="0"
            value={tripDays}
            onChange={(e) => setTripDays(e.target.value)}
            style={{ width: '80px' }}
          />
        </label>
      </div>
      <div className="tool-panel">
        <label>Budget categories</label>
        {categories.map((cat, i) => (
          <div key={i} className="tool-controls" style={{ marginBottom: 8 }}>
            <input
              type="text"
              value={cat.name}
              onChange={(e) => updateName(i, e.target.value)}
              style={{ flex: 1, minWidth: 120, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text-h)' }}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={cat.amount}
              onChange={(e) => updateAmount(i, e.target.value)}
              style={{ width: '110px' }}
            />
            <button onClick={() => removeCategory(i)} disabled={categories.length <= 1}>
              Remove
            </button>
          </div>
        ))}
      </div>
      {total > 0 && (
        <div className="timestamp-result">
          <span>
            <strong>Total trip budget:</strong> {total.toFixed(2)}
          </span>
          {perDay !== null && (
            <span>
              <strong>Average per day:</strong> {perDay.toFixed(2)} ({days} day{days === 1 ? '' : 's'})
            </span>
          )}
          {breakdown.map((c, i) => (
            <span key={i}>
              {c.name}: {c.value.toFixed(2)} ({c.percent.toFixed(1)}%)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
