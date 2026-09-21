import { useState } from 'react';
const DEG_TO_RAD = Math.PI / 180;
export default function TrigonometryCalculator() {
  const [angle, setAngle] = useState('30');
  const [unit, setUnit] = useState('deg');
  const angleNum = Number(angle);
  const valid = Number.isFinite(angleNum);
  const rad = valid ? (unit === 'deg' ? angleNum * DEG_TO_RAD : angleNum) : null;
  const sin = rad !== null ? Math.sin(rad) : null;
  const cos = rad !== null ? Math.cos(rad) : null;
  const cosIsZero = cos !== null && Math.abs(cos) < 1e-12;
  const tan = rad !== null ? (cosIsZero ? null : Math.tan(rad)) : null;
  return (
    <div className="tool-page">
      <h1>Trigonometry Calculator</h1>
      <p className="tool-description">
        Calculate sine, cosine, and tangent for an angle in degrees or radians. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} style={{ width: '120px' }} />
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="deg">Degrees</option>
          <option value="rad">Radians</option>
        </select>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a valid number.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>sin:</strong> {sin.toFixed(6)}
          </div>
          <div>
            <strong>cos:</strong> {cos.toFixed(6)}
          </div>
          <div>
            <strong>tan:</strong> {tan === null ? 'undefined (cos = 0)' : tan.toFixed(6)}
          </div>
          <div>
            <strong>In {unit === 'deg' ? 'radians' : 'degrees'}:</strong>{' '}
            {unit === 'deg' ? rad.toFixed(6) : (angleNum / DEG_TO_RAD).toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
}
