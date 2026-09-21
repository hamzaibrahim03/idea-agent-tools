import { useState } from 'react';
export default function ProbabilityCalculator() {
  const [favorable, setFavorable] = useState('1');
  const [total, setTotal] = useState('6');
  const [probA, setProbA] = useState('0.5');
  const [probB, setProbB] = useState('0.5');
  const favorableNum = Number(favorable);
  const totalNum = Number(total);
  const singleValid =
    Number.isFinite(favorableNum) && favorableNum >= 0 &&
    Number.isFinite(totalNum) && totalNum > 0 && favorableNum <= totalNum;
  const singleProb = singleValid ? favorableNum / totalNum : null;
  const probANum = Number(probA);
  const probBNum = Number(probB);
  const combinedValid =
    Number.isFinite(probANum) && probANum >= 0 && probANum <= 1 &&
    Number.isFinite(probBNum) && probBNum >= 0 && probBNum <= 1;
  const both = combinedValid ? probANum * probBNum : null;
  const either = combinedValid ? probANum + probBNum - both : null;
  return (
    <div className="tool-page">
      <h1>Probability Calculator</h1>
      <p className="tool-description">
        Calculate the probability of a single event from favorable/total outcomes, or combine two
        independent event probabilities with AND / OR. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label>Single event: favorable outcomes / total outcomes</label>
        <div className="tool-controls">
          <input type="number" min={0} value={favorable} onChange={(e) => setFavorable(e.target.value)} style={{ width: '90px' }} />
          <span>/</span>
          <input type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} style={{ width: '90px' }} />
        </div>
      </div>
      {!singleValid && (
        <div className="tool-error">
          <strong>Error:</strong> Total must be positive and favorable outcomes between 0 and total.
        </div>
      )}
      {singleProb !== null && (
        <div className="timestamp-result">
          <div>
            <strong>P(event):</strong> {singleProb.toFixed(4)} ({(singleProb * 100).toFixed(2)}%)
          </div>
        </div>
      )}
      <div className="tool-panel" style={{ marginTop: 24 }}>
        <label>Two independent events: P(A) and P(B), each 0 to 1</label>
        <div className="tool-controls">
          <input type="number" min={0} max={1} step={0.01} value={probA} onChange={(e) => setProbA(e.target.value)} style={{ width: '90px' }} />
          <input type="number" min={0} max={1} step={0.01} value={probB} onChange={(e) => setProbB(e.target.value)} style={{ width: '90px' }} />
        </div>
      </div>
      {!combinedValid && (
        <div className="tool-error">
          <strong>Error:</strong> P(A) and P(B) must each be between 0 and 1.
        </div>
      )}
      {both !== null && (
        <div className="timestamp-result">
          <div>
            <strong>P(A and B), independent:</strong> {both.toFixed(4)}
          </div>
          <div>
            <strong>P(A or B), independent:</strong> {either.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
}
