import { useState } from 'react';
function adjustForInflation(amount, startYear, endYear, annualRatePercent) {
  const years = endYear - startYear;
  const r = annualRatePercent / 100;
  const adjustedAmount = amount * (1 + r) ** years;
  return { adjustedAmount, years };
}
export default function InflationCalculator() {
  const [amount, setAmount] = useState('1000');
  const [startYear, setStartYear] = useState('2000');
  const [endYear, setEndYear] = useState('2026');
  const [rate, setRate] = useState('3');
  const amountNum = Number(amount);
  const startYearNum = Number(startYear);
  const endYearNum = Number(endYear);
  const rateNum = Number(rate);
  const valid =
    Number.isFinite(amountNum) && amountNum >= 0 &&
    Number.isInteger(startYearNum) &&
    Number.isInteger(endYearNum) &&
    Number.isFinite(rateNum);
  const result = valid ? adjustForInflation(amountNum, startYearNum, endYearNum, rateNum) : null;
  const isFuture = result && result.years >= 0;
  return (
    <div className="tool-page">
      <h1>Inflation Calculator</h1>
      <p className="tool-description">
        Calculate the equivalent purchasing-power-adjusted value of an amount between two years,
        using a compound annual inflation rate that you provide (this tool does not look up
        historical inflation data). Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Amount:
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Start year:
          <input type="number" value={startYear} onChange={(e) => setStartYear(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          End year:
          <input type="number" value={endYear} onChange={(e) => setEndYear(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Average annual inflation rate (%):
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a non-negative amount, whole number years, and a numeric inflation rate.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>
              Equivalent value in {endYear}:
            </strong>{' '}
            {result.adjustedAmount.toFixed(2)}
          </div>
          <div>
            <strong>Number of years:</strong> {Math.abs(result.years)} {isFuture ? '(forward)' : '(backward)'}
          </div>
        </div>
      )}
    </div>
  );
}
