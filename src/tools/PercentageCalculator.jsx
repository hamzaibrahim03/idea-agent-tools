import { useEffect, useState } from 'react';
export default function PercentageCalculator() {
  const [percent, setPercent] = useState('25');
  const [ofValue, setOfValue] = useState('200');
  const [partValue, setPartValue] = useState('50');
  const [wholeValue, setWholeValue] = useState('200');
  const [fromValue, setFromValue] = useState('100');
  const [toValue, setToValue] = useState('120');
  const [result, setResult] = useState({ percentOfResult: null, whatPercentResult: null, changeResult: null });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/percentage-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { percent, ofValue, partValue, wholeValue, fromValue, toValue } })
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
  }, [percent, ofValue, partValue, wholeValue, fromValue, toValue]);
  const { percentOfResult, whatPercentResult, changeResult } = result;
  return (
    <div className="tool-page">
      <h1>Percentage Calculator</h1>
      <p className="tool-description">
        Three common percentage calculations in one place. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-panel">
        <label>What is X% of Y?</label>
        <div className="tool-controls">
          <input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} style={{ width: '90px' }} />
          <span>% of</span>
          <input type="number" value={ofValue} onChange={(e) => setOfValue(e.target.value)} style={{ width: '110px' }} />
          <span>=</span>
          <strong>{percentOfResult !== null ? percentOfResult.toLocaleString() : '—'}</strong>
        </div>
      </div>
      <div className="tool-panel">
        <label>X is what percent of Y?</label>
        <div className="tool-controls">
          <input type="number" value={partValue} onChange={(e) => setPartValue(e.target.value)} style={{ width: '110px' }} />
          <span>is what % of</span>
          <input type="number" value={wholeValue} onChange={(e) => setWholeValue(e.target.value)} style={{ width: '110px' }} />
          <span>=</span>
          <strong>{whatPercentResult !== null ? `${whatPercentResult.toFixed(2)}%` : '—'}</strong>
        </div>
      </div>
      <div className="tool-panel">
        <label>Percentage change from X to Y</label>
        <div className="tool-controls">
          <input type="number" value={fromValue} onChange={(e) => setFromValue(e.target.value)} style={{ width: '110px' }} />
          <span>to</span>
          <input type="number" value={toValue} onChange={(e) => setToValue(e.target.value)} style={{ width: '110px' }} />
          <span>=</span>
          <strong>
            {changeResult !== null ? `${changeResult > 0 ? '+' : ''}${changeResult.toFixed(2)}%` : '—'}
          </strong>
        </div>
      </div>
    </div>
  );
}
