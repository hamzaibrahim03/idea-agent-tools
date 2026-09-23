import { useEffect, useState } from 'react';
export default function ManufacturingRiskChecklist() {
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  const [sections, setSections] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [summary, setSummary] = useState('');
  const [fetchError, setFetchError] = useState('');
  function toggle(key) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function resetAll() {
    setChecked({});
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/manufacturing-risk-checklist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { checked } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else {
            setSections(data.sections || []);
            setTotalItems(data.totalItems || 0);
            setCheckedCount(data.checkedCount || 0);
            setSummary(data.summary || '');
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [checked]);
  function itemKey(sectionIdx, itemIdx) {
    return `${sectionIdx}-${itemIdx}`;
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Manufacturing Risk Checklist</h1>
      <p className="tool-description">
        A reference checklist covering common manufacturing floor risk areas - machine safety,
        chemical handling, PPE, fire safety, and electrical safety - with items you can check off as
        you go. Copy or print a summary of checked vs. unchecked items. This is a general reference
        checklist, not a substitute for a formal safety audit or your local regulatory requirements.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy summary'}
        </button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
        <button type="button" onClick={resetAll}>
          Reset all
        </button>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Progress:</strong> {checkedCount} / {totalItems} items checked
        </div>
      </div>
      {sections.map((s, si) => (
        <div className="tool-panel" key={s.section}>
          <label>{s.section}</label>
          <ul className="uuid-list">
            {s.items.map((item, ii) => {
              const key = itemKey(si, ii);
              return (
                <li key={key}>
                  <label className="checkbox-label" style={{ flex: 1 }}>
                    <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} />
                    {item}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
