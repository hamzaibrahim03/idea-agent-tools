import { useState } from 'react';
const DEFAULT_GROUPS = [
  { animalType: 'Dairy cattle', count: '40', dailyFeedLbs: '55' },
  { animalType: 'Laying hens', count: '200', dailyFeedLbs: '0.25' }
];
export default function LivestockFeedCalculator() {
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  function updateGroup(index, field, value) {
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)));
  }
  function addGroup() {
    setGroups((prev) => [...prev, { animalType: '', count: '', dailyFeedLbs: '' }]);
  }
  function removeGroup(index) {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  }
  const rows = groups.map((g) => {
    const count = Number(g.count);
    const perAnimal = Number(g.dailyFeedLbs);
    const validRow = Number.isFinite(count) && count >= 0 && Number.isFinite(perAnimal) && perAnimal >= 0;
    const dailyTotal = validRow ? count * perAnimal : 0;
    return { ...g, count, perAnimal, validRow, dailyTotal };
  });
  const totalDaily = rows.reduce((sum, r) => sum + r.dailyTotal, 0);
  const totalMonthly = totalDaily * 30;
  return (
    <div className="tool-page">
      <h1>Livestock Feed Calculator</h1>
      <p className="tool-description">
        Add animal groups with the number of animals and daily feed requirement per animal (this
        varies by animal type and weight, so enter your own figure from a feed plan or vet guidance)
        to compute total daily and monthly feed needed. Runs entirely in your browser.
      </p>
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
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <input type="text" value={r.animalType} onChange={(e) => updateGroup(i, 'animalType', e.target.value)} placeholder="e.g. Dairy cattle" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} value={r.count} onChange={(e) => updateGroup(i, 'count', e.target.value)} style={{ width: '90px' }} />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={r.dailyFeedLbs} onChange={(e) => updateGroup(i, 'dailyFeedLbs', e.target.value)} style={{ width: '100px' }} />
                </td>
                <td>
                  <code>{r.dailyTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</code>
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
