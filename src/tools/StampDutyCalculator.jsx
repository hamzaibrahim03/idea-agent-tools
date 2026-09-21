import { useState } from 'react';
const DEFAULT_BRACKETS = [
  { upTo: 125000, rate: 0 },
  { upTo: 250000, rate: 2 },
  { upTo: 925000, rate: 5 },
  { upTo: 1500000, rate: 10 },
  { upTo: Infinity, rate: 12 }
];
function calculateStampDuty(price, brackets) {
  let duty = 0;
  let lowerBound = 0;
  for (const bracket of brackets) {
    if (price <= lowerBound) break;
    const taxableInBracket = Math.min(price, bracket.upTo) - lowerBound;
    if (taxableInBracket > 0) {
      duty += taxableInBracket * (bracket.rate / 100);
    }
    lowerBound = bracket.upTo;
  }
  return duty;
}
export default function StampDutyCalculator() {
  const [price, setPrice] = useState('400000');
  const [brackets, setBrackets] = useState(DEFAULT_BRACKETS);
  function updateBracket(index, field, value) {
    setBrackets((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value === '' ? '' : Number(value) } : b))
    );
  }
  function resetBrackets() {
    setBrackets(DEFAULT_BRACKETS);
  }
  const priceNum = Number(price);
  const valid = Number.isFinite(priceNum) && priceNum >= 0 && brackets.every((b) => Number.isFinite(b.upTo) && Number.isFinite(b.rate));
  const duty = valid ? calculateStampDuty(priceNum, brackets) : 0;
  const effectiveRate = valid && priceNum > 0 ? (duty / priceNum) * 100 : 0;
  return (
    <div className="tool-page">
      <h1>Stamp Duty / Transfer Tax Calculator</h1>
      <p className="tool-description">
        Estimate transfer/stamp duty tax on a property purchase using an editable table of
        progressive tax brackets. The default brackets are a simple illustrative example only -
        actual rates vary hugely by country and state/province, so edit the table to match your
        local rules. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Illustrative only:</strong> The default bracket values are not real tax rates for
        any specific jurisdiction. Check with your local tax authority or a qualified professional
        for accurate figures.
      </div>
      <div className="tool-controls">
        <label>
          Property price:
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '110px' }} />
        </label>
        <button type="button" onClick={resetBrackets}>
          Reset brackets to default
        </button>
      </div>
      <div className="tool-panel">
        <label>Tax brackets (editable)</label>
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Up to (price)</th>
                <th>Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {brackets.map((b, i) => (
                <tr key={i}>
                  <td>
                    {b.upTo === Infinity ? (
                      'No limit'
                    ) : (
                      <input
                        type="number"
                        min={0}
                        value={b.upTo}
                        onChange={(e) => updateBracket(i, 'upTo', e.target.value)}
                        style={{ width: '110px' }}
                      />
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={b.rate}
                      onChange={(e) => updateBracket(i, 'rate', e.target.value)}
                      style={{ width: '70px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative price and make sure all bracket values are numbers.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Estimated stamp duty:</strong> {duty.toFixed(2)}
          </div>
          <div>
            <strong>Effective rate:</strong> {effectiveRate.toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}
