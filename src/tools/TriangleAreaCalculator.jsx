import { useEffect, useState } from 'react';
export default function TriangleAreaCalculator() {
  const [mode, setMode] = useState('base-height');
  const [base, setBase] = useState('10');
  const [height, setHeight] = useState('5');
  const [sideA, setSideA] = useState('3');
  const [sideB, setSideB] = useState('4');
  const [sideC, setSideC] = useState('5');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [agentError, setAgentError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setAgentError('');
      fetch('/api/tools/triangle-area-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { mode, base, height, sideA, sideB, sideC } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setAgentError(data.error);
          else {
            setResult(data.result);
            setError(data.error);
          }
        })
        .catch((e) => { if (!cancelled) setAgentError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [mode, base, height, sideA, sideB, sideC]);
  return (
    <div className="tool-page">
      <h1>Triangle Area Calculator</h1>
      <p className="tool-description">
        Calculate a triangle's area from its base and height, or from three side lengths using
        Heron's formula. Runs entirely in your browser.
      </p>
      {agentError && <div className="agent-error">{agentError}</div>}
      <div className="tool-controls">
        <label>
          Method:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="base-height">Base &amp; height</option>
            <option value="sides">Three sides (Heron's formula)</option>
          </select>
        </label>
      </div>
      {mode === 'base-height' ? (
        <div className="tool-controls">
          <label>
            Base:
            <input type="number" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: '90px' }} />
          </label>
          <label>
            Height:
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={{ width: '90px' }} />
          </label>
        </div>
      ) : (
        <div className="tool-controls">
          <label>
            Side a:
            <input type="number" value={sideA} onChange={(e) => setSideA(e.target.value)} style={{ width: '90px' }} />
          </label>
          <label>
            Side b:
            <input type="number" value={sideB} onChange={(e) => setSideB(e.target.value)} style={{ width: '90px' }} />
          </label>
          <label>
            Side c:
            <input type="number" value={sideC} onChange={(e) => setSideC(e.target.value)} style={{ width: '90px' }} />
          </label>
        </div>
      )}
      {error && <div className="tool-error">{error}</div>}
      {result !== null && !error && (
        <div className="timestamp-result">
          <strong>Area = {result}</strong>
        </div>
      )}
    </div>
  );
}
