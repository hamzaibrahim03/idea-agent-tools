import { useState } from 'react';
const CATEGORIES = {
  Length: {
    base: 'meter',
    units: {
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344
    }
  },
  Weight: {
    base: 'kilogram',
    units: {
      milligram: 0.000001,
      gram: 0.001,
      kilogram: 1,
      ounce: 0.0283495,
      pound: 0.453592,
      stone: 6.35029
    }
  },
  Temperature: {
    units: { Celsius: 'C', Fahrenheit: 'F', Kelvin: 'K' }
  }
};
function convertTemperature(value, from, to) {
  if (from === to) return value;
  let celsius;
  if (from === 'Celsius') celsius = value;
  else if (from === 'Fahrenheit') celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;
  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}
export default function UnitConverter() {
  const [category, setCategory] = useState('Length');
  const unitNames = Object.keys(CATEGORIES[category].units);
  const [fromUnit, setFromUnit] = useState(unitNames[0]);
  const [toUnit, setToUnit] = useState(unitNames[1]);
  const [value, setValue] = useState('1');
  function handleCategoryChange(next) {
    const names = Object.keys(CATEGORIES[next].units);
    setCategory(next);
    setFromUnit(names[0]);
    setToUnit(names[1]);
  }
  const result = (() => {
    if (value === '' || Number.isNaN(Number(value))) return null;
    const num = Number(value);
    if (category === 'Temperature') return convertTemperature(num, fromUnit, toUnit);
    const { units } = CATEGORIES[category];
    return (num * units[fromUnit]) / units[toUnit];
  })();
  return (
    <div className="tool-page">
      <h1>Unit Converter</h1>
      <p className="tool-description">
        Convert between common length, weight, and temperature units. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <label>
          Category:
          <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
            {Object.keys(CATEGORIES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-controls">
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: '120px' }} />
        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
          {Object.keys(CATEGORIES[category].units).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <span>=</span>
        <strong>{result !== null ? Number(result.toFixed(6)) : '—'}</strong>
        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
          {Object.keys(CATEGORIES[category].units).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
