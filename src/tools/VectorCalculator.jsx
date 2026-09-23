import { useState } from 'react';
function parseVector(text) {
  const parts = text.split(',').map((s) => Number(s.trim()));
  if (parts.length < 2 || parts.length > 3 || parts.some((n) => !Number.isFinite(n))) return null;
  return parts;
}
function pad(v) {
  return v.length === 2 ? [...v, 0] : v;
}
function add(a, b) {
  return a.map((v, i) => v + b[i]);
}
function sub(a, b) {
  return a.map((v, i) => v - b[i]);
}
function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
function cross(a, b) {
  const [a1, a2, a3] = pad(a);
  const [b1, b2, b3] = pad(b);
  return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
}
function magnitude(v) {
  return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
}
function format(v) {
  return `(${v.map((n) => Number(n.toFixed(6))).join(', ')})`;
}
export default function VectorCalculator() {
  const [vecA, setVecA] = useState('1, 2, 3');
  const [vecB, setVecB] = useState('4, 5, 6');
  const a = parseVector(vecA);
  const b = parseVector(vecB);
  const valid = a !== null && b !== null;
  const same2D = valid && vecA.split(',').length === vecB.split(',').length;
  const magA = valid ? magnitude(a) : null;
  const magB = valid ? magnitude(b) : null;
  const sumVec = valid && same2D ? add(a, b) : null;
  const diffVec = valid && same2D ? sub(a, b) : null;
  const dotProduct = valid && same2D ? dot(a, b) : null;
  const crossProduct = valid ? cross(a, b) : null;
  const angleRad = valid && same2D && magA > 0 && magB > 0 ? Math.acos(Math.min(1, Math.max(-1, dotProduct / (magA * magB)))) : null;
  return (
    <div className="tool-page">
      <h1>Vector Calculator</h1>
      <p className="tool-description">
        Add, subtract, and compute the dot product, cross product, magnitude, and angle between
        two 2D or 3D vectors. Enter components separated by commas, e.g. "1, 2, 3". Runs entirely
        in your browser.
      </p>
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
              <strong>A + B:</strong> {format(sumVec)}
            </div>
          )}
          {diffVec && (
            <div>
              <strong>A − B:</strong> {format(diffVec)}
            </div>
          )}
          {dotProduct !== null && (
            <div>
              <strong>A · B (dot product):</strong> {dotProduct.toFixed(6)}
            </div>
          )}
          <div>
            <strong>A × B (cross product):</strong> {format(crossProduct)}
          </div>
          {angleRad !== null && (
            <div>
              <strong>Angle between A and B:</strong> {(angleRad * (180 / Math.PI)).toFixed(4)}°
            </div>
          )}
        </div>
      )}
    </div>
  );
}
