import { useState } from 'react';
export default function TipCalculator() {
  const [bill, setBill] = useState('50');
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState(1);
  const billNum = Number(bill) || 0;
  const tipAmount = (billNum * tipPercent) / 100;
  const total = billNum + tipAmount;
  const peopleNum = Math.max(1, Number(people) || 1);
  return (
    <div className="tool-page">
      <h1>Tip Calculator</h1>
      <p className="tool-description">
        Calculate a tip and split the bill between any number of people. Runs entirely in your
        browser.
      </p>
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
          <strong>Per person:</strong> {(total / peopleNum).toFixed(2)} ({(tipAmount / peopleNum).toFixed(2)} tip each)
        </span>
      </div>
    </div>
  );
}
