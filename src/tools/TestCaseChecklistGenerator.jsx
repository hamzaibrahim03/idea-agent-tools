import { useEffect, useState } from 'react';
const CATEGORY_OPTIONS = [
  { key: 'unit', label: 'Unit' },
  { key: 'integration', label: 'Integration' },
  { key: 'e2e', label: 'End-to-end (E2E)' }
];
export default function TestCaseChecklistGenerator() {
  const [feature, setFeature] = useState('');
  const [category, setCategory] = useState('unit');
  const [checked, setChecked] = useState({});
  const [items, setItems] = useState([]);
  const [label, setLabel] = useState('Unit');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    fetch('/api/tools/test-case-checklist-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { category } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else {
          setError('');
          setItems(data.items);
          setLabel(data.label);
        }
      })
      .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    return () => { cancelled = true; };
  }, [category]);
  function toggle(item) {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
  }
  const checkedCount = items.filter((i) => checked[i]).length;
  return (
    <div className="tool-page">
      <h1>Test Case Checklist Generator</h1>
      <p className="tool-description">
        Describe the feature or function you're testing and pick a testing category (unit,
        integration, or end-to-end) to get a curated checklist of common test-case categories to
        consider - happy path, edge cases, error handling, boundary values, and more. This is a
        checklist of things to consider, not AI-generated test cases for your specific code. Runs
        entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <input
          type="text"
          value={feature}
          onChange={(e) => setFeature(e.target.value)}
          placeholder="Feature or function under test (e.g. 'user login')"
          style={{ flex: 1, minWidth: 220, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text-h)' }}
        />
        <label>
          Testing category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label>
          {label} test checklist{feature ? ` for "${feature}"` : ''} ({checkedCount}/{items.length} considered)
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
