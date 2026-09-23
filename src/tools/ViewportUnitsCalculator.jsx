import { useState } from 'react';
function pxToViewportUnits(px, vw, vh) {
  const vwValue = (px / vw) * 100;
  const vhValue = (px / vh) * 100;
  return {
    vw: vwValue,
    vh: vhValue,
    vmin: Math.min(vwValue, vhValue),
    vmax: Math.max(vwValue, vhValue),
  };
}
function viewportUnitToPx(value, unit, vw, vh) {
  switch (unit) {
    case 'vw':
      return (value / 100) * vw;
    case 'vh':
      return (value / 100) * vh;
    case 'vmin':
      return (value / 100) * Math.min(vw, vh);
    case 'vmax':
      return (value / 100) * Math.max(vw, vh);
    default:
      return null;
  }
}
export default function ViewportUnitsCalculator() {
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [pxValue, setPxValue] = useState(24);
  const [reverseValue, setReverseValue] = useState(2);
  const [reverseUnit, setReverseUnit] = useState('vw');
  const vwNum = Number(viewportWidth);
  const vhNum = Number(viewportHeight);
  const viewportValid = Number.isFinite(vwNum) && Number.isFinite(vhNum) && vwNum > 0 && vhNum > 0;
  const pxNum = Number(pxValue);
  const forwardValid = viewportValid && Number.isFinite(pxNum);
  const forwardResult = forwardValid ? pxToViewportUnits(pxNum, vwNum, vhNum) : null;
  const reverseNum = Number(reverseValue);
  const reverseValid = viewportValid && Number.isFinite(reverseNum);
  const reversePx = reverseValid ? viewportUnitToPx(reverseNum, reverseUnit, vwNum, vhNum) : null;
  return (
    <div className="tool-page">
      <h1>Viewport Units Calculator</h1>
      <p className="tool-description">
        Convert a pixel value to its equivalent vw/vh/vmin/vmax value for a given reference
        viewport size, or convert a viewport unit value back to pixels. Runs entirely in your
        browser.
      </p>
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
