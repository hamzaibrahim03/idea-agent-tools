import { useEffect, useState } from 'react';
export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('10');
  const [term, setTerm] = useState('12');
  const [termUnit, setTermUnit] = useState('months');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/loan-emi-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { principal, rate, term, termUnit } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setResult(null);
          } else {
            setError('');
            setResult(data);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [principal, rate, term, termUnit]);
  return (
    <div className="tool-page">
      <h1>Loan EMI Calculator</h1>
      <p className="tool-description">
        Calculate the Equated Monthly Installment (EMI) for a loan, along with total interest and
        total payment, using the standard reducing-balance amortization formula.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Loan amount:
          <input type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} style={{ width: '110px' }} />
        </label>
        <label>
          Annual interest rate (%):
          <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Loan term:
          <input type="number" min={0} value={term} onChange={(e) => setTerm(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          Unit:
          <select value={termUnit} onChange={(e) => setTermUnit(e.target.value)}>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </label>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && !error && (
        <div className="timestamp-result">
          <div>
            <strong>Monthly EMI:</strong> {result.emi.toFixed(2)}
          </div>
          <div>
            <strong>Total interest:</strong> {result.totalInterest.toFixed(2)}
          </div>
          <div>
            <strong>Total payment:</strong> {result.totalPayment.toFixed(2)}
          </div>
          <div>
            <strong>Number of installments:</strong> {result.months}
          </div>
        </div>
      )}
    </div>
  );
}
