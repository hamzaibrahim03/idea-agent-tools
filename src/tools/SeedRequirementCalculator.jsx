import { useEffect, useState } from 'react';
export default function SeedRequirementCalculator() {
  const [area, setArea] = useState('50');
  const [areaUnit, setAreaUnit] = useState('acres');
  const [seedingRate, setSeedingRate] = useState('120');
  const [rateUnit, setRateUnit] = useState('lbs');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/seed-requirement-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { area, seedingRate } })
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
  }, [area, seedingRate]);
  const valid = result?.valid ?? false;
  const totalSeed = result?.totalSeed ?? null;
  return (
    <div className="tool-page">
      <h1>Seed Requirement Calculator</h1>
      <p className="tool-description">
        Enter your field area and seeding rate (per acre or hectare, since this varies by crop
        variety and target population - enter your own rate from seed tag or agronomist guidance) to
        compute total seed quantity needed. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="src-area">Field area</label>
          <input id="src-area" type="number" min={0} step="0.01" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="src-areaunit">Area unit</label>
          <select id="src-areaunit" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
          </select>
        </div>
        <div className="tool-panel">
          <label htmlFor="src-rate">Seeding rate (per {areaUnit === 'acres' ? 'acre' : 'hectare'})</label>
          <input id="src-rate" type="number" min={0} step="0.01" value={seedingRate} onChange={(e) => setSeedingRate(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="src-rateunit">Weight unit</label>
          <select id="src-rateunit" value={rateUnit} onChange={(e) => setRateUnit(e.target.value)}>
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive field area and a positive seeding rate.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Total seed needed:</strong> {totalSeed.toLocaleString(undefined, { maximumFractionDigits: 2 })} {rateUnit}
          </div>
        </div>
      )}
    </div>
  );
}
