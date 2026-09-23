import { useEffect, useState } from 'react';
export default function TrigonometryCalculator() {
  const [angle, setAngle] = useState('30');
  const [unit, setUnit] = useState('deg');
  const [result, setResult] = useState({ valid: false });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/trigonometry-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { angle, unit } })
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
  }, [angle, unit]);
  const { valid, sin, cos, tan, converted } = result;
  return (
    <div className="tool-page">
      <h1>Trigonometry Calculator</h1>
      <p className="tool-description">
        Calculate sine, cosine, and tangent for an angle in degrees or radians. Runs entirely in
        your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
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
            {unit === 'deg' ? converted.toFixed(6) : converted.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
}
