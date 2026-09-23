import { useEffect, useState } from 'react';
export default function ViewportUnitsCalculator() {
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [pxValue, setPxValue] = useState(24);
  const [reverseValue, setReverseValue] = useState(2);
  const [reverseUnit, setReverseUnit] = useState('vw');
  const [result, setResult] = useState({ viewportValid: false, forwardResult: null, reversePx: null });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/viewport-units-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { viewportWidth, viewportHeight, pxValue, reverseValue, reverseUnit } })
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
  }, [viewportWidth, viewportHeight, pxValue, reverseValue, reverseUnit]);
  const { viewportValid, forwardResult, reversePx } = result;
  return (
    <div className="tool-page">
      <h1>Viewport Units Calculator</h1>
      <p className="tool-description">
        Convert a pixel value to its equivalent vw/vh/vmin/vmax value for a given reference
        viewport size, or convert a viewport unit value back to pixels. Runs entirely in your
        browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Reference viewport width (px):
          <input
            type="number"
            value={viewportWidth}
            onChange={(e) => setViewportWidth(e.target.value)}
            style={{ width: '90px' }}
          />
        </label>
        <label>
          Reference viewport height (px):
          <input
            type="number"
            value={viewportHeight}
            onChange={(e) => setViewportHeight(e.target.value)}
            style={{ width: '90px' }}
          />
        </label>
      </div>
      {!viewportValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive viewport width and height values.
        </div>
      )}
      {viewportValid && (
        <>
          <div className="tool-panel">
            <label htmlFor="px-input">Pixels to viewport units</label>
            <input
              id="px-input"
              type="number"
              value={pxValue}
              onChange={(e) => setPxValue(e.target.value)}
              style={{ width: '120px' }}
            />
          </div>
          {forwardResult && (
            <ul className="uuid-list">
              <li>
                <span>vw</span>
                <code>{forwardResult.vw.toFixed(4)}vw</code>
              </li>
              <li>
                <span>vh</span>
                <code>{forwardResult.vh.toFixed(4)}vh</code>
              </li>
              <li>
                <span>vmin</span>
                <code>{forwardResult.vmin.toFixed(4)}vmin</code>
              </li>
              <li>
                <span>vmax</span>
                <code>{forwardResult.vmax.toFixed(4)}vmax</code>
              </li>
            </ul>
          )}
          <div className="tool-panel">
            <label>Viewport unit to pixels</label>
            <div className="tool-controls">
              <input
                type="number"
                value={reverseValue}
                onChange={(e) => setReverseValue(e.target.value)}
                style={{ width: '100px' }}
              />
              <select value={reverseUnit} onChange={(e) => setReverseUnit(e.target.value)}>
                <option value="vw">vw</option>
                <option value="vh">vh</option>
                <option value="vmin">vmin</option>
                <option value="vmax">vmax</option>
              </select>
            </div>
            {reversePx !== null && (
              <div className="timestamp-result">
                <span>
                  <strong>Pixels:</strong> <code>{reversePx.toFixed(2)}px</code>
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
