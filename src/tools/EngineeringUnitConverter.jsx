import { useState } from 'react';
const CATEGORIES = {
  Pressure: {
    base: 'pascal',
    units: {
      pascal: 1,
      kilopascal: 1000,
      bar: 100000,
      psi: 6894.76,
      atmosphere: 101325,
      'mm Hg': 133.322
    }
  },
  Force: {
    base: 'newton',
    units: {
      newton: 1,
      kilonewton: 1000,
      'pound-force (lbf)': 4.44822,
      'kilogram-force (kgf)': 9.80665,
      dyne: 0.00001
    }
  },
  'Stress / Load (pressure-based)': {
    base: 'pascal',
    units: {
      pascal: 1,
      megapascal: 1000000,
      kilopascal: 1000,
      psi: 6894.76,
      ksi: 6894760
    }
  }
};
export default function EngineeringUnitConverter() {
  const [category, setCategory] = useState('Pressure');
  const unitNames = Object.keys(CATEGORIES[category].units);
  const [fromUnit, setFromUnit] = useState(unitNames[0]);
  const [toUnit, setToUnit] = useState(unitNames[3] || unitNames[1]);
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
    const { units } = CATEGORIES[category];
    return (num * units[fromUnit]) / units[toUnit];
  })();
  return (
    <div className="tool-page">
      <h1>Engineering Unit Converter</h1>
      <p className="tool-description">
        Convert between common engineering units for pressure, force, and stress/load - psi, kPa,
        bar, N, lbf, MPa, and more. Runs entirely in your browser.
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
        <strong>{result !== null ? Number(result.toPrecision(6)) : '—'}</strong>
        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
          {Object.keys(CATEGORIES[category].units).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <div className="tool-error">
        <strong>Note:</strong> These are standard published conversion factors for reference. For
        structural or engineering work used in real designs, a licensed engineer must verify all
        calculations.
      </div>
    </div>
  );
}
