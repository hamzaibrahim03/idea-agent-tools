import { useState } from 'react';
function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}
function simplifyRatio(width, height) {
  const divisor = gcd(width, height);
  return { w: width / divisor, h: height / divisor };
}
export default function AspectRatioCalculator() {
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [knownWidth, setKnownWidth] = useState('1280');
  const [ratioW, setRatioW] = useState('16');
  const [ratioH, setRatioH] = useState('9');
  const widthNum = Number(width);
  const heightNum = Number(height);
  const ratioValid = Number.isFinite(widthNum) && Number.isFinite(heightNum) && widthNum > 0 && heightNum > 0;
  const simplified = ratioValid ? simplifyRatio(widthNum, heightNum) : null;
  const decimalRatio = ratioValid ? widthNum / heightNum : null;
  const knownWidthNum = Number(knownWidth);
  const ratioWNum = Number(ratioW);
  const ratioHNum = Number(ratioH);
  const calcValid =
    Number.isFinite(knownWidthNum) && Number.isFinite(ratioWNum) && Number.isFinite(ratioHNum) &&
    knownWidthNum > 0 && ratioWNum > 0 && ratioHNum > 0;
  const calculatedHeight = calcValid ? (knownWidthNum * ratioHNum) / ratioWNum : null;
  return (
    <div className="tool-page">
      <h1>Aspect Ratio Calculator</h1>
      <p className="tool-description">
        Simplify a width/height pair to its simplest ratio (via GCD), or calculate a missing
        dimension from a known width and a target ratio. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label>Simplify a ratio</label>
        <div className="tool-controls">
          <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Width" style={{ width: '100px' }} />
          <span>:</span>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height" style={{ width: '100px' }} />
        </div>
        {!ratioValid && (
          <div className="tool-error-inline">Enter positive width and height values.</div>
        )}
        {ratioValid && (
          <div className="timestamp-result">
            <span>
              <strong>Simplified ratio:</strong> <code>{simplified.w}:{simplified.h}</code>
            </span>
            <span>
              <strong>Decimal ratio:</strong> <code>{decimalRatio.toFixed(4)}</code>
            </span>
          </div>
        )}
      </div>
      <div className="tool-panel">
        <label>Calculate height from width + ratio</label>
        <div className="tool-controls">
          <label>
            Width:
            <input type="number" value={knownWidth} onChange={(e) => setKnownWidth(e.target.value)} style={{ width: '100px' }} />
          </label>
          <label>
            Ratio:
            <input type="number" value={ratioW} onChange={(e) => setRatioW(e.target.value)} style={{ width: '60px' }} />
          </label>
          <span>:</span>
          <input type="number" value={ratioH} onChange={(e) => setRatioH(e.target.value)} style={{ width: '60px' }} />
        </div>
        {!calcValid && (
          <div className="tool-error-inline">Enter positive width and ratio values.</div>
        )}
        {calcValid && (
          <div className="timestamp-result">
            <span>
              <strong>Calculated height:</strong> <code>{calculatedHeight.toFixed(2)}</code>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
