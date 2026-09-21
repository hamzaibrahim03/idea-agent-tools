import { useState } from 'react';
const CATEGORIES = {
  unit: {
    label: 'Unit',
    items: [
      'Happy path with typical valid input', 'Boundary values (min, max, zero, off-by-one)',
      'Null / undefined / missing input', 'Empty string / empty array / empty object',
      'Invalid type input', 'Negative numbers where only positive expected',
      'Very large input (performance / overflow)', 'Function called with no arguments',
      'Return value type and shape correctness', 'Error/exception handling paths'
    ]
  },
  integration: {
    label: 'Integration',
    items: [
      'Correct data passed between components/modules', 'Dependent service returns success',
      'Dependent service returns an error / times out', 'Database read/write consistency',
      'Correct handling of partial failures', 'Authentication/authorization between components',
      'Data format mismatches between systems', 'Retry and fallback behavior',
      'Configuration differences between environments', 'Concurrent access / race conditions'
    ]
  },
  e2e: {
    label: 'End-to-end (E2E)',
    items: [
      'Full happy-path user journey completes successfully', 'Form validation errors shown to user',
      'Navigation between pages/screens works as expected', 'Session/auth expiration handled gracefully',
      'Data persists correctly across page reloads', 'Responsive behavior on different screen sizes',
      'Third-party integration failures handled gracefully', 'Loading and empty states render correctly',
      'Accessibility of key user flows (keyboard, screen reader)', 'Cross-browser behavior consistency'
    ]
  }
};
export default function TestCaseChecklistGenerator() {
  const [feature, setFeature] = useState('');
  const [category, setCategory] = useState('unit');
  const [checked, setChecked] = useState({});
  const items = CATEGORIES[category].items;
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
            {Object.entries(CATEGORIES).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label>
          {CATEGORIES[category].label} test checklist{feature ? ` for "${feature}"` : ''} ({checkedCount}/{items.length} considered)
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
