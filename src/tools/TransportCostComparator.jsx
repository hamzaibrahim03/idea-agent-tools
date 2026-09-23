import { useEffect, useState } from 'react';
let nextId = 1;
function makeDefaultOptions() {
  return [
    { id: nextId++, mode: 'Flight', cost: '', duration: '' },
    { id: nextId++, mode: 'Train', cost: '', duration: '' },
    { id: nextId++, mode: 'Bus', cost: '', duration: '' }
  ];
}
export default function TransportCostComparator() {
  const [options, setOptions] = useState(makeDefaultOptions);
  const [sortBy, setSortBy] = useState('cost');
  const [sorted, setSorted] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/transport-cost-comparator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { options, sortBy } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setSorted(data.sorted);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [options, sortBy]);
  function update(id, field, value) {
    setOptions((opts) => opts.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  }
  function addOption() {
    if (options.length >= 3) return;
    setOptions((opts) => [...opts, { id: nextId++, mode: `Option ${opts.length + 1}`, cost: '', duration: '' }]);
  }
  function removeOption(id) {
    setOptions((opts) => opts.filter((o) => o.id !== id));
  }
  return (
    <div className="tool-page">
      <h1>Transport Cost Comparator</h1>
      <p className="tool-description">
        Enter 2-3 transport options you've researched yourself - mode, cost, and duration - to see
        them compared side by side, sorted by cost or time. This tool does not look up real fares
        or schedules; all figures come from you. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button onClick={addOption} disabled={options.length >= 3}>Add option (max 3)</button>
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="cost">Cost</option>
            <option value="duration">Duration</option>
          </select>
        </label>
      </div>
      <div className="tool-panel">
        <label>Transport options</label>
        {options.map((opt) => (
          <div key={opt.id} className="tool-controls" style={{ marginBottom: 8 }}>
            <input
              type="text"
              value={opt.mode}
              onChange={(e) => update(opt.id, 'mode', e.target.value)}
              placeholder="Mode (e.g. Flight)"
              style={{ flex: 1, minWidth: 100, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text-h)' }}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={opt.cost}
              onChange={(e) => update(opt.id, 'cost', e.target.value)}
              placeholder="Cost"
              style={{ width: '100px' }}
            />
            <input
              type="number"
              min="0"
              step="0.1"
              value={opt.duration}
              onChange={(e) => update(opt.id, 'duration', e.target.value)}
              placeholder="Duration (hrs)"
              style={{ width: '120px' }}
            />
            <button onClick={() => removeOption(opt.id)} disabled={options.length <= 2}>Remove</button>
          </div>
        ))}
      </div>
      {sorted.length > 0 && (
        <div className="tool-panel">
          <label>Comparison (sorted by {sortBy})</label>
          <div style={{ overflowX: 'auto' }}>
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Mode</th>
                  <th>Cost</th>
                  <th>Duration (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((o) => (
                  <tr key={o.id}>
                    <td>{o.mode || 'Unnamed'}</td>
                    <td>{o.cost !== '' ? o.costNum.toFixed(2) : '-'}</td>
                    <td>{o.duration !== '' ? o.durationNum.toFixed(1) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
