import { useEffect, useState } from 'react';
export default function IrrigationCalculator() {
  const [areaAcres, setAreaAcres] = useState('10');
  const [waterReqIn, setWaterReqIn] = useState('1.5');
  const [efficiency, setEfficiency] = useState('85');
  const [outputUnit, setOutputUnit] = useState('gallons');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/irrigation-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { areaAcres, waterReqIn, efficiency } })
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
  }, [areaAcres, waterReqIn, efficiency]);
  return (
    <div className="tool-page">
      <h1>Irrigation Calculator</h1>
      <p className="tool-description">
        Enter field area, crop water requirement, and your irrigation system's efficiency to estimate
        total water volume needed per week. Water requirement varies by crop and climate, so enter
        your own figure (e.g. from local agricultural extension guidance) rather than a looked-up
        value.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="irr-area">Field area (acres)</label>
          <input id="irr-area" type="number" min={0} step="0.01" value={areaAcres} onChange={(e) => setAreaAcres(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="irr-req">Crop water requirement (inches/week)</label>
          <input id="irr-req" type="number" min={0} step="0.01" value={waterReqIn} onChange={(e) => setWaterReqIn(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="irr-eff">Irrigation system efficiency (%)</label>
          <input id="irr-eff" type="number" min={1} max={100} step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="irr-unit">Output unit</label>
          <select id="irr-unit" value={outputUnit} onChange={(e) => setOutputUnit(e.target.value)}>
            <option value="gallons">Gallons</option>
            <option value="liters">Liters</option>
          </select>
        </div>
      </div>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && !error && (
        <div className="timestamp-result">
          <div>
            <strong>Water needed per week:</strong>{' '}
            {outputUnit === 'gallons'
              ? `${result.volumeGallons.toLocaleString(undefined, { maximumFractionDigits: 0 })} gallons`
              : `${result.volumeLiters.toLocaleString(undefined, { maximumFractionDigits: 0 })} liters`}
          </div>
        </div>
      )}
    </div>
  );
}
