import { useEffect, useState } from 'react';
export default function VectorCalculator() {
  const [vecA, setVecA] = useState('1, 2, 3');
  const [vecB, setVecB] = useState('4, 5, 6');
  const [result, setResult] = useState({ valid: false });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/vector-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { vecA, vecB } })
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
  }, [vecA, vecB]);
  const { valid, same2D, magA, magB, sumVec, diffVec, dotProduct, crossProduct, angleDeg } = result;
  return (
    <div className="tool-page">
      <h1>Vector Calculator</h1>
      <p className="tool-description">
        Add, subtract, and compute the dot product, cross product, magnitude, and angle between
        two 2D or 3D vectors. Enter components separated by commas, e.g. "1, 2, 3". Runs entirely
        in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="vec-a">Vector A</label>
          <input id="vec-a" type="text" value={vecA} onChange={(e) => setVecA(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="vec-b">Vector B</label>
          <input id="vec-b" type="text" value={vecB} onChange={(e) => setVecB(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter 2 or 3 comma-separated numbers for each vector.
        </div>
      )}
      {valid && !same2D && (
        <div className="tool-error">
          <strong>Note:</strong> Addition, subtraction, dot product, and angle require vectors of the same dimension. Cross product is still shown (3D, zero-padded).
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>|A|:</strong> {magA.toFixed(4)}
          </div>
          <div>
            <strong>|B|:</strong> {magB.toFixed(4)}
          </div>
          {sumVec && (
            <div>
              <strong>A + B:</strong> {sumVec}
            </div>
          )}
          {diffVec && (
            <div>
              <strong>A − B:</strong> {diffVec}
            </div>
          )}
          {dotProduct !== null && (
            <div>
              <strong>A · B (dot product):</strong> {dotProduct.toFixed(6)}
            </div>
          )}
          <div>
            <strong>A × B (cross product):</strong> {crossProduct}
          </div>
          {angleDeg !== null && (
            <div>
              <strong>Angle between A and B:</strong> {angleDeg.toFixed(4)}°
            </div>
          )}
        </div>
      )}
    </div>
  );
}
