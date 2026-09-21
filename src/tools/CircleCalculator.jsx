import { useState } from 'react';
function formatNum(n) {
  return Number(n.toFixed(6)).toString();
}
function fromRadius(r) {
  return {
    radius: r,
    diameter: 2 * r,
    circumference: 2 * Math.PI * r,
    area: Math.PI * r * r,
  };
}
export default function CircleCalculator() {
  const [field, setField] = useState('radius');
  const [value, setValue] = useState('5');
  const num = Number(value);
  let error = '';
  let result = null;
  if (value === '' || Number.isNaN(num) || num <= 0) {
    error = 'Enter a positive number.';
  } else {
    let radius;
    if (field === 'radius') radius = num;
    else if (field === 'diameter') radius = num / 2;
    else if (field === 'circumference') radius = num / (2 * Math.PI);
    else radius = Math.sqrt(num / Math.PI);
    result = fromRadius(radius);
  }
  const fieldLabels = {
    radius: 'Radius',
    diameter: 'Diameter',
    circumference: 'Circumference',
    area: 'Area',
  };
  return (
    <div className="tool-page">
      <h1>Circle Calculator</h1>
      <p className="tool-description">
        Enter any one of radius, diameter, circumference, or area to calculate the other three.
        Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Given:
          <select value={field} onChange={(e) => setField(e.target.value)}>
            <option value="radius">Radius</option>
            <option value="diameter">Diameter</option>
            <option value="circumference">Circumference</option>
            <option value="area">Area</option>
          </select>
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: '140px' }}
        />
      </div>
      {error && <div className="tool-error">{error}</div>}
      {result && !error && (
        <div className="timestamp-result">
          {Object.entries(fieldLabels).map(([key, label]) => (
            <span key={key}>
              <strong>{label}:</strong> {formatNum(result[key])}
              {key === field ? ' (given)' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
