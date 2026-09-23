import { useEffect, useState } from 'react';
export default function TaxCalculator() {
  const [income, setIncome] = useState('60000');
  const [brackets, setBrackets] = useState([
    { threshold: '0', rate: '10' },
    { threshold: '11000', rate: '15' },
    { threshold: '44000', rate: '25' },
    { threshold: '95000', rate: '35' }
  ]);
  const [result, setResult] = useState({ valid: false });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/tax-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { income, brackets } })
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
  }, [income, brackets]);
  function updateBracket(index, field, value) {
    setBrackets((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  }
  function addBracket() {
    setBrackets((prev) => [...prev, { threshold: '', rate: '' }]);
  }
  function removeBracket(index) {
    setBrackets((prev) => prev.filter((_, i) => i !== index));
  }
  const { valid, totalTax, effectiveRate, afterTax } = result;
  return (
    <div className="tool-page">
      <h1>Tax Calculator (Progressive Brackets)</h1>
      <p className="tool-description">
        Estimate tax owed using an editable progressive tax bracket table - each bracket's rate
        applies only to the portion of income within that bracket. The default brackets are a
        simple illustrative example, not any real country's actual tax code - edit the thresholds
        and rates to match your own situation. This is for illustration only and is not tax advice;
        consult a tax professional for your actual filing. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-panel">
        <label htmlFor="income-input">Total taxable income</label>
        <input id="income-input" type="number" min={0} value={income} onChange={(e) => setIncome(e.target.value)} style={{ width: '160px' }} />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addBracket}>
          Add bracket
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Bracket starts at</th>
              <th>Rate (%)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {brackets.map((b, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={b.threshold}
                    onChange={(e) => updateBracket(i, 'threshold', e.target.value)}
                    style={{ width: '110px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={b.rate}
                    onChange={(e) => updateBracket(i, 'rate', e.target.value)}
                    style={{ width: '80px' }}
                  />
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeBracket(i)} disabled={brackets.length <= 1}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative income and at least one bracket with a non-negative threshold and rate.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Total tax owed:</strong> <code>{totalTax.toFixed(2)}</code>
          </div>
          <div>
            <strong>Effective tax rate:</strong> <code>{effectiveRate.toFixed(2)}%</code>
          </div>
          <div>
            <strong>Income after tax:</strong> <code>{afterTax.toFixed(2)}</code>
          </div>
        </div>
      )}
    </div>
  );
}
