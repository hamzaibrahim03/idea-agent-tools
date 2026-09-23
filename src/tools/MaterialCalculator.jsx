import { useEffect, useState } from 'react';
const MIX_RATIOS = {
  '1:1.5:3': { label: '1:1.5:3 (M20, structural)' },
  '1:2:4': { label: '1:2:4 (M15, general RCC)' },
  '1:3:6': { label: '1:3:6 (M10, mass concrete)' },
  '1:4:8': { label: '1:4:8 (PCC, leveling/foundation)' }
};
export default function MaterialCalculator() {
  const [area, setArea] = useState('50');
  const [thickness, setThickness] = useState('100');
  const [ratioKey, setRatioKey] = useState('1:2:4');
  const [steelDensity, setSteelDensity] = useState('80');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/material-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { area, thickness, ratioKey, steelDensity } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setResult(null);
          } else {
            setError('');
            setResult(data);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [area, thickness, ratioKey, steelDensity]);
  return (
    <div className="tool-page">
      <h1>Construction Material Calculator</h1>
      <p className="tool-description">
        Estimate cement, sand, aggregate, and steel reinforcement quantities for a slab or room using
        the standard dry-volume concrete mix-ratio method (wet volume x 1.54 to account for voids,
        then split by your chosen mix ratio). Steel weight is estimated from a reinforcement density
        you provide per square meter. This is a planning estimate - confirm with a structural
        engineer before ordering materials.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Mix ratio (cement:sand:aggregate):
          <select value={ratioKey} onChange={(e) => setRatioKey(e.target.value)}>
            {Object.entries(MIX_RATIOS).map(([key, r]) => (
              <option key={key} value={key}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="area">Area (sq m)</label>
          <input id="area" type="number" min={0} value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="thickness">Thickness (mm)</label>
          <input id="thickness" type="number" min={0} value={thickness} onChange={(e) => setThickness(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="steel-density">Steel reinforcement density (kg per sq m)</label>
          <input
            id="steel-density"
            type="number"
            min={0}
            value={steelDensity}
            onChange={(e) => setSteelDensity(e.target.value)}
          />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && !error && (
        <div className="timestamp-result">
          <div>
            <strong>Wet concrete volume:</strong> {result.wetVolumeM3.toFixed(3)} m³
          </div>
          <div>
            <strong>Dry volume (x1.54):</strong> {result.dryVolumeM3.toFixed(3)} m³
          </div>
          <div>
            <strong>Cement:</strong> {result.cementVolumeM3.toFixed(3)} m³ (~{Math.ceil(result.cementBags)} bags of 50 kg)
          </div>
          <div>
            <strong>Sand:</strong> {result.sandVolumeM3.toFixed(3)} m³
          </div>
          <div>
            <strong>Aggregate:</strong> {result.aggregateVolumeM3.toFixed(3)} m³
          </div>
          <div>
            <strong>Steel reinforcement:</strong> {result.steelKg.toFixed(1)} kg
          </div>
        </div>
      )}
    </div>
  );
}
