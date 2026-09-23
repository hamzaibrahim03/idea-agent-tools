import { useEffect, useState } from 'react';
export default function SafetyChecklistGenerator() {
  const [workplace, setWorkplace] = useState('factory');
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState({ label: '', items: [], workplaces: [] });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    setError('');
    fetch('/api/tools/workplace-safety-checklist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { workplace } })
    })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    return () => { cancelled = true; };
  }, [workplace]);
  function toggle(index) {
    setChecked((prev) => ({ ...prev, [`${workplace}-${index}`]: !prev[`${workplace}-${index}`] }));
  }
  const items = data.items || [];
  const checkedCount = items.filter((_, i) => checked[`${workplace}-${i}`]).length;
  function buildSummary() {
    const lines = [`${data.label} Safety Checklist`, ''];
    items.forEach((item, i) => {
      lines.push(`[${checked[`${workplace}-${i}`] ? 'x' : ' '}] ${item}`);
    });
    lines.push('', `Completed: ${checkedCount} / ${items.length}`);
    return lines.join('\n');
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  const workplaces = data.workplaces && data.workplaces.length ? data.workplaces : [
    { key: 'factory', label: 'Factory Floor' },
    { key: 'warehouse', label: 'Warehouse' },
    { key: 'office', label: 'Office' }
  ];
  return (
    <div className="tool-page">
      <h1>Workplace Safety Checklist</h1>
      <p className="tool-description">
        Pick a workplace type and get a curated reference safety checklist you can check off, copy, or
        print. These are general reference checklists, not a substitute for a formal safety audit or
        your local regulatory requirements. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Workplace type:
          <select value={workplace} onChange={(e) => setWorkplace(e.target.value)}>
            {workplaces.map((w) => (
              <option key={w.key} value={w.key}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy summary'}
        </button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Progress:</strong> {checkedCount} / {items.length} items checked
        </div>
      </div>
      <div className="tool-panel">
        <label>{data.label} Checklist</label>
        <ul className="uuid-list">
          {items.map((item, i) => (
            <li key={i}>
              <label className="checkbox-label" style={{ flex: 1 }}>
                <input type="checkbox" checked={!!checked[`${workplace}-${i}`]} onChange={() => toggle(i)} />
                {item}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
