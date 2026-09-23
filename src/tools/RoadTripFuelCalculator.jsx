import { useEffect, useState } from 'react';
export default function RoadTripFuelCalculator() {
  const [distance, setDistance] = useState('500');
  const [efficiency, setEfficiency] = useState('30');
  const [fuelPrice, setFuelPrice] = useState('3.50');
  const [tankRange, setTankRange] = useState('350');
  const [unit, setUnit] = useState('mi/gal');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/road-trip-fuel-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { distance, efficiency, fuelPrice, tankRange, unit } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [distance, efficiency, fuelPrice, tankRange, unit]);
  const isMetric = unit === 'km/L';
  const d = result?.d ?? 0;
  const eff = result?.eff ?? 0;
  const range = result?.range ?? 0;
  const fuelUnitLabel = result?.fuelUnitLabel ?? (isMetric ? 'L' : 'gal');
  const fuelNeeded = result?.fuelNeeded ?? 0;
  const totalCost = result?.totalCost ?? 0;
  const stops = result?.stops ?? 0;
  return (
    <div className="tool-page">
      <h1>Road Trip Fuel Calculator</h1>
      <p className="tool-description">
        Enter your total trip distance, vehicle fuel efficiency, fuel price, and tank range yourself
        (this tool has no access to real routing or mapping data) to estimate total fuel cost and
        how many fuel stops you'll likely need. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Units:
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="mi/gal">Miles / Gallons</option>
            <option value="km/L">Kilometers / Liters</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="rt-distance">Total trip distance ({isMetric ? 'km' : 'miles'}) - your own estimate</label>
          <input id="rt-distance" type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rt-eff">Fuel efficiency ({unit})</label>
          <input id="rt-eff" type="number" min="0" step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rt-price">Fuel price (per {fuelUnitLabel})</label>
          <input id="rt-price" type="number" min="0" step="0.01" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rt-range">Tank range ({isMetric ? 'km' : 'miles'} per full tank)</label>
          <input id="rt-range" type="number" min="0" value={tankRange} onChange={(e) => setTankRange(e.target.value)} />
        </div>
      </div>
      {d > 0 && eff > 0 && (
        <div className="timestamp-result">
          <span>
            <strong>Fuel needed:</strong> {fuelNeeded.toFixed(1)} {fuelUnitLabel}
          </span>
          <span>
            <strong>Estimated total fuel cost:</strong> {totalCost.toFixed(2)}
          </span>
          {range > 0 && (
            <span>
              <strong>Estimated fuel stops needed:</strong> {stops}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
