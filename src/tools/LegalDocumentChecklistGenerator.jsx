import { useEffect, useState } from 'react';
const SCENARIO_NAMES = ['Starting a business', 'Signing a lease', 'Hiring an employee', 'Buying a home'];
export default function LegalDocumentChecklistGenerator() {
  const [scenario, setScenario] = useState('Starting a business');
  const [checked, setChecked] = useState({});
  const [items, setItems] = useState([]);
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    setFetchError('');
    fetch('/api/tools/legal-document-checklist-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { scenario } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setFetchError(data.error);
        else {
          setItems(data.items || []);
          setChecked({});
        }
      })
      .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    return () => { cancelled = true; };
  }, [scenario]);
  function toggle(item) {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  }
  const checkedCount = items.filter((item) => checked[item]).length;
  return (
    <div className="tool-page">
      <h1>Legal Document Checklist Generator</h1>
      <p className="tool-description">
        Pick a common life/business scenario to see a curated reference checklist of
        commonly-needed legal documents and steps.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is a general reference checklist, not personalized
        legal advice. Requirements vary significantly by jurisdiction and individual
        circumstances - consult a qualified lawyer for guidance specific to your situation.
      </div>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Scenario:
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {SCENARIO_NAMES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <strong>
          Progress: {checkedCount} / {items.length}
        </strong>
      </div>
      <div className="tool-panel">
        <label>{scenario}</label>
        {items.map((item) => (
          <label className="checkbox-label" key={item}>
            <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}
