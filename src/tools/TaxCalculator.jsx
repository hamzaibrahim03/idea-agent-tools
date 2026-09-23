import { useState } from 'react';
function computeTax(income, brackets) {
  const sorted = [...brackets].sort((a, b) => a.threshold - b.threshold);
  let tax = 0;
  for (let i = 0; i < sorted.length; i++) {
    const lower = sorted[i].threshold;
    const upper = i + 1 < sorted.length ? sorted[i + 1].threshold : Infinity;
    if (income <= lower) break;
    const taxableInBracket = Math.min(income, upper) - lower;
    tax += taxableInBracket * (sorted[i].rate / 100);
  }
  return tax;
}
export default function TaxCalculator() {
  const [income, setIncome] = useState('60000');
  const [brackets, setBrackets] = useState([
    { threshold: '0', rate: '10' },
    { threshold: '11000', rate: '15' },
    { threshold: '44000', rate: '25' },
    { threshold: '95000', rate: '35' }
  ]);
  function updateBracket(index, field, value) {
    setBrackets((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  }
  function addBracket() {
    setBrackets((prev) => [...prev, { threshold: '', rate: '' }]);
  }
  function removeBracket(index) {
    setBrackets((prev) => prev.filter((_, i) => i !== index));
  }
  const incomeNum = Number(income);
  const parsedBrackets = brackets.map((b) => ({ threshold: Number(b.threshold), rate: Number(b.rate) }));
  const bracketsValid = parsedBrackets.every((b) => Number.isFinite(b.threshold) && b.threshold >= 0 && Number.isFinite(b.rate) && b.rate >= 0);
  const valid = Number.isFinite(incomeNum) && incomeNum >= 0 && bracketsValid && parsedBrackets.length > 0;
  const totalTax = valid ? computeTax(incomeNum, parsedBrackets) : 0;
  const effectiveRate = valid && incomeNum > 0 ? (totalTax / incomeNum) * 100 : 0;
  const afterTax = valid ? incomeNum - totalTax : 0;
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
