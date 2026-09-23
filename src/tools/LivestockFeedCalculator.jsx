import { useEffect, useState } from 'react';
const DEFAULT_GROUPS = [
  { animalType: 'Dairy cattle', count: '40', dailyFeedLbs: '55' },
  { animalType: 'Laying hens', count: '200', dailyFeedLbs: '0.25' }
];
export default function LivestockFeedCalculator() {
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [rows, setRows] = useState([]);
  const [totalDaily, setTotalDaily] = useState(0);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [fetchError, setFetchError] = useState('');
  function updateGroup(index, field, value) {
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)));
  }
  function addGroup() {
    setGroups((prev) => [...prev, { animalType: '', count: '', dailyFeedLbs: '' }]);
  }
  function removeGroup(index) {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/livestock-feed-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { groups } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else {
            setRows(data.rows || []);
            setTotalDaily(data.totalDaily || 0);
            setTotalMonthly(data.totalMonthly || 0);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [groups]);
  return (
    <div className="tool-page">
      <h1>Livestock Feed Calculator</h1>
      <p className="tool-description">
        Add animal groups with the number of animals and daily feed requirement per animal (this
        varies by animal type and weight, so enter your own figure from a feed plan or vet guidance)
        to compute total daily and monthly feed needed.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <button type="button" onClick={addGroup}>
          Add animal group
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Animal type</th>
              <th>Number of animals</th>
              <th>Daily feed per animal (lbs)</th>
              <th>Daily total (lbs)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g, i) => (
              <tr key={i}>
                <td>
                  <input type="text" value={g.animalType} onChange={(e) => updateGroup(i, 'animalType', e.target.value)} placeholder="e.g. Dairy cattle" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} value={g.count} onChange={(e) => updateGroup(i, 'count', e.target.value)} style={{ width: '90px' }} />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={g.dailyFeedLbs} onChange={(e) => updateGroup(i, 'dailyFeedLbs', e.target.value)} style={{ width: '100px' }} />
                </td>
                <td>
                  <code>{(rows[i]?.dailyTotal ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</code>
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeGroup(i)} disabled={groups.length <= 1}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Total daily feed needed:</strong> {totalDaily.toLocaleString(undefined, { maximumFractionDigits: 2 })} lbs
        </div>
        <div>
          <strong>Total monthly feed needed (30 days):</strong> {totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })} lbs
        </div>
      </div>
    </div>
  );
}
