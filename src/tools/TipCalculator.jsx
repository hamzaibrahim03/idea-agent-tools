import { useEffect, useState } from 'react';
export default function TipCalculator() {
  const [bill, setBill] = useState('50');
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState(1);
  const [result, setResult] = useState({ tipAmount: 0, total: 0, perPerson: 0, tipPerPerson: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/tip-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { bill, tipPercent, people } })
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
  }, [bill, tipPercent, people]);
  const { tipAmount, total, perPerson, tipPerPerson } = result;
  return (
    <div className="tool-page">
      <h1>Tip Calculator</h1>
      <p className="tool-description">
        Calculate a tip and split the bill between any number of people. Runs entirely in your
        browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Bill amount:
          <input type="number" min={0} value={bill} onChange={(e) => setBill(e.target.value)} style={{ width: '100px' }} />
        </label>
        <label>
          Tip %:
          <input
            type="number"
            min={0}
            max={100}
            value={tipPercent}
            onChange={(e) => setTipPercent(Number(e.target.value))}
            style={{ width: '70px' }}
          />
        </label>
        <label>
          Split between:
          <input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} style={{ width: '70px' }} />
        </label>
      </div>
      <div className="tool-controls">
        {[10, 15, 18, 20, 25].map((p) => (
          <button key={p} onClick={() => setTipPercent(p)}>
            {p}%
          </button>
        ))}
      </div>
      <div className="timestamp-result">
        <span>
          <strong>Tip amount:</strong> {tipAmount.toFixed(2)}
        </span>
        <span>
          <strong>Total:</strong> {total.toFixed(2)}
        </span>
        <span>
          <strong>Per person:</strong> {perPerson.toFixed(2)} ({tipPerPerson.toFixed(2)} tip each)
        </span>
      </div>
    </div>
  );
}
