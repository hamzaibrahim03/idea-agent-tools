import { useState } from 'react';
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
  const parsed = categories.map((c) => ({ ...c, value: parseFloat(c.amount) || 0 }));
  const total = parsed.reduce((sum, c) => sum + c.value, 0);
  const days = parseFloat(tripDays);
  const perDay = days > 0 ? total / days : null;
  return (
    <div className="tool-page">
      <h1>Travel Budget Calculator</h1>
      <p className="tool-description">
        Enter your own trip budget by category - flights, hotels, food, activities, transport, or
        any categories you add - to see your total trip budget and a percentage breakdown. All
        amounts are figures you enter yourself. Runs entirely in your browser.
      </p>
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
          {parsed
            .filter((c) => c.value > 0)
            .map((c, i) => (
              <span key={i}>
                {c.name}: {c.value.toFixed(2)} ({((c.value / total) * 100).toFixed(1)}%)
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
