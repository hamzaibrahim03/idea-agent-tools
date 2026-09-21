import { useState } from 'react';
const BREAKDOWN = [
  { key: 'structure', label: 'Structure (foundation, frame, walls, roof)', pct: 43 },
  { key: 'finishing', label: 'Finishing (flooring, paint, doors, windows, fixtures)', pct: 30 },
  { key: 'electrical', label: 'Electrical', pct: 8 },
  { key: 'plumbing', label: 'Plumbing', pct: 7 },
  { key: 'other', label: 'Other (site prep, permits, contingency)', pct: 12 }
];
const RATE_PER_SQFT = {
  economy: 100,
  standard: 160,
  premium: 260
};
export default function HouseConstructionEstimator() {
  const [builtUpArea, setBuiltUpArea] = useState('1800');
  const [floors, setFloors] = useState('2');
  const [tier, setTier] = useState('standard');
  const [rate, setRate] = useState(String(RATE_PER_SQFT.standard));
  function handleTier(value) {
    setTier(value);
    setRate(String(RATE_PER_SQFT[value]));
  }
  const areaNum = Number(builtUpArea);
  const floorsNum = Number(floors);
  const rateNum = Number(rate);
  const valid =
    Number.isFinite(areaNum) && areaNum > 0 &&
    Number.isFinite(floorsNum) && floorsNum > 0 &&
    Number.isFinite(rateNum) && rateNum > 0;
  const totalArea = valid ? areaNum * floorsNum : 0;
  const totalCost = valid ? totalArea * rateNum : 0;
  return (
    <div className="tool-page">
      <h1>House Construction Cost Estimator</h1>
      <p className="tool-description">
        Get a high-level total cost estimate for a house build from built-up area, number of floors,
        and quality tier, broken down by category (structure, finishing, electrical, plumbing, other)
        using commonly published typical percentage splits. These percentages are general industry
        rules of thumb, not a quote for your specific project - actual splits vary by design and
        region. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Quality tier:
          <select value={tier} onChange={(e) => handleTier(e.target.value)}>
            <option value="economy">Economy</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="built-up-area">Built-up area per floor (sq ft)</label>
          <input
            id="built-up-area"
            type="number"
            min={0}
            value={builtUpArea}
            onChange={(e) => setBuiltUpArea(e.target.value)}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="floors">Number of floors</label>
          <input id="floors" type="number" min={1} step="1" value={floors} onChange={(e) => setFloors(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rate">Rate ($/sq ft)</label>
          <input id="rate" type="number" min={0} value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive area, a positive number of floors, and a positive rate.
        </div>
      )}
      {valid && (
        <>
          <div className="timestamp-result">
            <div>
              <strong>Total built-up area:</strong> {totalArea.toLocaleString()} sq ft
            </div>
            <div>
              <strong>Estimated total cost:</strong> ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="regex-groups-wrap" style={{ marginTop: 16 }}>
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Typical %</th>
                  <th>Estimated cost</th>
                </tr>
              </thead>
              <tbody>
                {BREAKDOWN.map((b) => (
                  <tr key={b.key}>
                    <td>{b.label}</td>
                    <td>{b.pct}%</td>
                    <td>
                      <code>${((totalCost * b.pct) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
