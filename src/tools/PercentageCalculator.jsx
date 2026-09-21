import { useState } from 'react';
export default function PercentageCalculator() {
  const [percent, setPercent] = useState('25');
  const [ofValue, setOfValue] = useState('200');
  const [partValue, setPartValue] = useState('50');
  const [wholeValue, setWholeValue] = useState('200');
  const [fromValue, setFromValue] = useState('100');
  const [toValue, setToValue] = useState('120');
  const percentOfResult =
    percent !== '' && ofValue !== '' ? (Number(percent) / 100) * Number(ofValue) : null;
  const whatPercentResult =
    partValue !== '' && wholeValue !== '' && Number(wholeValue) !== 0
      ? (Number(partValue) / Number(wholeValue)) * 100
      : null;
  const changeResult =
    fromValue !== '' && toValue !== '' && Number(fromValue) !== 0
      ? ((Number(toValue) - Number(fromValue)) / Number(fromValue)) * 100
      : null;
  return (
    <div className="tool-page">
      <h1>Percentage Calculator</h1>
      <p className="tool-description">
        Three common percentage calculations in one place. Runs entirely in your browser.
      </p>
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
