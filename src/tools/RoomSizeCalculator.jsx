import { useState } from 'react';
export default function RoomSizeCalculator() {
  const [mode, setMode] = useState('ratio');
  const [targetArea, setTargetArea] = useState('200');
  const [aspectRatio, setAspectRatio] = useState('1.5');
  const [fixedDimension, setFixedDimension] = useState('10');
  const areaNum = Number(targetArea);
  const areaValid = Number.isFinite(areaNum) && areaNum > 0;
  let result = null;
  let error = '';
  if (mode === 'ratio') {
    const ratioNum = Number(aspectRatio);
    if (!areaValid) {
      error = 'Enter a positive target area.';
    } else if (!Number.isFinite(ratioNum) || ratioNum <= 0) {
      error = 'Enter a positive aspect ratio (length ÷ width).';
    } else {
      const width = Math.sqrt(areaNum / ratioNum);
      const length = width * ratioNum;
      result = { width, length };
    }
  } else {
    const fixedNum = Number(fixedDimension);
    if (!areaValid) {
      error = 'Enter a positive target area.';
    } else if (!Number.isFinite(fixedNum) || fixedNum <= 0) {
      error = 'Enter a positive fixed dimension.';
    } else {
      const other = areaNum / fixedNum;
      result = { fixed: fixedNum, other };
    }
  }
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
      {error && <div className="tool-error">{error}</div>}
      {result && !error && (
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
