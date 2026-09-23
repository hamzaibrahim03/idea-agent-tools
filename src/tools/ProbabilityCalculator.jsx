import { useEffect, useState } from 'react';
export default function ProbabilityCalculator() {
  const [favorable, setFavorable] = useState('1');
  const [total, setTotal] = useState('6');
  const [probA, setProbA] = useState('0.5');
  const [probB, setProbB] = useState('0.5');
  const [result, setResult] = useState({ singleValid: false, singleProb: null, combinedValid: false, both: null, either: null });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/probability-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { favorable, total, probA, probB } })
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
  }, [favorable, total, probA, probB]);
  const { singleValid, singleProb, combinedValid, both, either } = result;
  return (
    <div className="tool-page">
      <h1>Probability Calculator</h1>
      <p className="tool-description">
        Calculate the probability of a single event from favorable/total outcomes, or combine two
        independent event probabilities with AND / OR. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-panel">
        <label>Single event: favorable outcomes / total outcomes</label>
        <div className="tool-controls">
          <input type="number" min={0} value={favorable} onChange={(e) => setFavorable(e.target.value)} style={{ width: '90px' }} />
          <span>/</span>
          <input type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} style={{ width: '90px' }} />
        </div>
      </div>
      {!error && !singleValid && (
        <div className="tool-error">
          <strong>Error:</strong> Total must be positive and favorable outcomes between 0 and total.
        </div>
      )}
      {!error && singleProb !== null && (
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
      {!error && !combinedValid && (
        <div className="tool-error">
          <strong>Error:</strong> P(A) and P(B) must each be between 0 and 1.
        </div>
      )}
      {!error && both !== null && (
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
