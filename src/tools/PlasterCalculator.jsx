import { useEffect, useState } from 'react';
export default function PlasterCalculator() {
  const [wallLength, setWallLength] = useState('20');
  const [wallHeight, setWallHeight] = useState('8');
  const [openingsArea, setOpeningsArea] = useState('0');
  const [thicknessMm, setThicknessMm] = useState('12');
  const [coverageSqFtPerBag, setCoverageSqFtPerBag] = useState('40');
  const [waste, setWaste] = useState('10');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/plaster-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { wallLength, wallHeight, openingsArea, thicknessMm, coverageSqFtPerBag, waste } })
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
  }, [wallLength, wallHeight, openingsArea, thicknessMm, coverageSqFtPerBag, waste]);
  const valid = result?.valid ?? false;
  const netArea = result?.netArea ?? 0;
  const volumeCuFt = result?.volumeCuFt ?? 0;
  const volumeCuM = result?.volumeCuM ?? 0;
  const bagsNeeded = result?.bagsNeeded ?? null;
  return (
    <div className="tool-page">
      <h1>Plaster / Render Calculator</h1>
      <p className="tool-description">
        Estimate the volume and number of bags of plaster or render needed to cover a wall, based
        on wall area, coat thickness, and your product's coverage per bag. Coverage varies
        significantly by product - check the bag label for the most accurate figure. Runs
        entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="plaster-length">Wall length (ft)</label>
          <input id="plaster-length" type="number" min={0} value={wallLength} onChange={(e) => setWallLength(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-height">Wall height (ft)</label>
          <input id="plaster-height" type="number" min={0} value={wallHeight} onChange={(e) => setWallHeight(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-openings">Doors/windows area to subtract (sq ft)</label>
          <input id="plaster-openings" type="number" min={0} value={openingsArea} onChange={(e) => setOpeningsArea(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-thickness">Coat thickness (mm)</label>
          <input id="plaster-thickness" type="number" min={0} value={thicknessMm} onChange={(e) => setThicknessMm(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-coverage">Bag coverage (sq ft per bag)</label>
          <input id="plaster-coverage" type="number" min={0} value={coverageSqFtPerBag} onChange={(e) => setCoverageSqFtPerBag(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="plaster-waste">Waste allowance (%)</label>
          <input id="plaster-waste" type="number" min={0} value={waste} onChange={(e) => setWaste(e.target.value)} />
        </div>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {!error && !valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive dimensions, thickness, and coverage, and a non-negative waste percentage.
        </div>
      )}
      {!error && valid && netArea <= 0 && (
        <div className="tool-error">
          <strong>Error:</strong> Net area after subtracting openings must be greater than zero.
        </div>
      )}
      {!error && bagsNeeded !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Net area to cover:</strong> {netArea.toFixed(2)} sq ft
          </div>
          <div>
            <strong>Estimated volume:</strong> {volumeCuFt.toFixed(2)} cu ft ({volumeCuM.toFixed(3)} m³)
          </div>
          <div>
            <strong>Bags needed (with {waste}% waste):</strong> {bagsNeeded}
          </div>
        </div>
      )}
    </div>
  );
}
