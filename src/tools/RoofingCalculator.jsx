import { useEffect, useState } from 'react';
export default function RoofingCalculator() {
  const [footprintLength, setFootprintLength] = useState('40');
  const [footprintWidth, setFootprintWidth] = useState('30');
  const [pitch, setPitch] = useState('6');
  const [waste, setWaste] = useState('10');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/roofing-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { footprintLength, footprintWidth, pitch, waste } })
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
  }, [footprintLength, footprintWidth, pitch, waste]);
  const valid = result?.valid ?? false;
  return (
    <div className="tool-page">
      <h1>Roofing Materials Calculator</h1>
      <p className="tool-description">
        Estimate roof surface area and shingle bundles needed from the building's footprint and
        roof pitch. Roofing is complex (hips, valleys, dormers) - this gives a planning-stage
        estimate for a simple roof shape, not a substitute for a contractor's measurement. Runs
        entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="roof-length">Building footprint length (ft)</label>
          <input id="roof-length" type="number" min={0} value={footprintLength} onChange={(e) => setFootprintLength(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roof-width">Building footprint width (ft)</label>
          <input id="roof-width" type="number" min={0} value={footprintWidth} onChange={(e) => setFootprintWidth(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roof-pitch">Roof pitch (rise per 12 in run)</label>
          <input id="roof-pitch" type="number" min={0} value={pitch} onChange={(e) => setPitch(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="roof-waste">Waste allowance (%)</label>
          <input id="roof-waste" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive footprint dimensions and non-negative pitch/waste values.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Footprint area:</strong> {result.footprintArea.toFixed(1)} sq ft
          </div>
          <div>
            <strong>Pitch multiplier:</strong> {result.multiplier.toFixed(3)}× ({result.pitchNum}:12 pitch)
          </div>
          <div>
            <strong>Actual roof area:</strong> {result.roofArea.toFixed(1)} sq ft
          </div>
          <div>
            <strong>With {result.wasteNum}% waste:</strong> {result.roofAreaWithWaste.toFixed(1)} sq ft ({result.squares.toFixed(2)} squares)
          </div>
          <div>
            <strong>Shingle bundles needed:</strong> {result.bundles} (at 3/square)
          </div>
        </div>
      )}
    </div>
  );
}
