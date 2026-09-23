import { useEffect, useState } from 'react';
const CATEGORY_UNITS = {
  Length: ['millimeter', 'centimeter', 'meter', 'kilometer', 'inch', 'foot', 'yard', 'mile'],
  Weight: ['milligram', 'gram', 'kilogram', 'ounce', 'pound', 'stone'],
  Temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
};
export default function UnitConverter() {
  const [category, setCategory] = useState('Length');
  const unitNames = CATEGORY_UNITS[category];
  const [fromUnit, setFromUnit] = useState(unitNames[0]);
  const [toUnit, setToUnit] = useState(unitNames[1]);
  const [value, setValue] = useState('1');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  function handleCategoryChange(next) {
    const names = CATEGORY_UNITS[next];
    setCategory(next);
    setFromUnit(names[0]);
    setToUnit(names[1]);
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/unit-converter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { category, value, fromUnit, toUnit } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data.result);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [category, value, fromUnit, toUnit]);
  return (
    <div className="tool-page">
      <h1>Unit Converter</h1>
      <p className="tool-description">
        Convert between common length, weight, and temperature units. Runs entirely in your
        browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Category:
          <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
            {Object.keys(CATEGORY_UNITS).map((c) => (
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
          {unitNames.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <span>=</span>
        <strong>{result !== null ? result : '—'}</strong>
        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
          {unitNames.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
