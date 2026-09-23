import { useEffect, useState } from 'react';
export default function RoomSizeCalculator() {
  const [mode, setMode] = useState('ratio');
  const [targetArea, setTargetArea] = useState('200');
  const [aspectRatio, setAspectRatio] = useState('1.5');
  const [fixedDimension, setFixedDimension] = useState('10');
  const [result, setResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/room-size-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { mode, targetArea, aspectRatio, fixedDimension } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setResult(data.result);
            setValidationError(data.validationError);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [mode, targetArea, aspectRatio, fixedDimension]);
  const areaNum = Number(targetArea);
  return (
    <div className="tool-page">
      <h1>Room Size Calculator</h1>
      <p className="tool-description">
        Work backward from a target room area to find the room's dimensions - either from a desired
        aspect ratio (length to width), or from one fixed dimension you already know. Runs entirely
        in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Method:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="ratio">Aspect ratio</option>
            <option value="fixed">One fixed dimension</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="rs-area">Target room area (sq ft)</label>
          <input id="rs-area" type="number" min={0} value={targetArea} onChange={(e) => setTargetArea(e.target.value)} />
        </div>
        {mode === 'ratio' ? (
          <div className="tool-panel">
            <label htmlFor="rs-ratio">Aspect ratio (length ÷ width, e.g. 1.5 for a 3:2 room)</label>
            <input id="rs-ratio" type="number" min={0} step="0.01" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} />
          </div>
        ) : (
          <div className="tool-panel">
            <label htmlFor="rs-fixed">Known dimension (ft)</label>
            <input id="rs-fixed" type="number" min={0} value={fixedDimension} onChange={(e) => setFixedDimension(e.target.value)} />
          </div>
        )}
      </div>
      {error && <div className="agent-error">{error}</div>}
      {validationError && <div className="tool-error">{validationError}</div>}
      {result && !validationError && (
        <div className="timestamp-result">
          {mode === 'ratio' ? (
            <>
              <div>
                <strong>Width:</strong> {result.width.toFixed(2)} ft
              </div>
              <div>
                <strong>Length:</strong> {result.length.toFixed(2)} ft
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>Fixed dimension:</strong> {result.fixed.toFixed(2)} ft
              </div>
              <div>
                <strong>Other dimension:</strong> {result.other.toFixed(2)} ft
              </div>
            </>
          )}
          <div>
            <strong>Resulting area:</strong> {areaNum.toFixed(2)} sq ft
          </div>
        </div>
      )}
    </div>
  );
}
