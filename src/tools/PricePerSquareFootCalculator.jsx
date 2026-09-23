import { useEffect, useState } from 'react';
export default function PricePerSquareFootCalculator() {
  const [mode, setMode] = useState('fromPrice');
  const [totalPrice, setTotalPrice] = useState('300000');
  const [totalSqft, setTotalSqft] = useState('1500');
  const [targetPricePerSqft, setTargetPricePerSqft] = useState('200');
  const [knownSqft, setKnownSqft] = useState('1500');
  const [result, setResult] = useState({ fromPriceValid: false, pricePerSqft: null, fromTargetValid: false, totalFromTarget: null });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/price-per-square-foot-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { totalPrice, totalSqft, targetPricePerSqft, knownSqft } })
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
  }, [totalPrice, totalSqft, targetPricePerSqft, knownSqft]);
  const { fromPriceValid, pricePerSqft, fromTargetValid, totalFromTarget } = result;
  return (
    <div className="tool-page">
      <h1>Price Per Square Foot Calculator</h1>
      <p className="tool-description">
        Calculate price per square foot from a total price and square footage, or work the reverse
        - a target price per square foot and known square footage - to estimate a total price.
        Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="fromPrice">Price -&gt; price/sq ft</option>
            <option value="fromRate">Price/sq ft -&gt; total price</option>
          </select>
        </label>
      </div>
      {error && <div className="agent-error">{error}</div>}
      {mode === 'fromPrice' && (
        <>
          <div className="tool-controls">
            <label>
              Total price:
              <input type="number" min={0} value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} style={{ width: '110px' }} />
            </label>
            <label>
              Total square feet:
              <input type="number" min={0} value={totalSqft} onChange={(e) => setTotalSqft(e.target.value)} style={{ width: '100px' }} />
            </label>
          </div>
          {!error && !fromPriceValid && (
            <div className="tool-error">
              <strong>Error:</strong> Enter a non-negative price and a positive square footage.
            </div>
          )}
          {!error && fromPriceValid && (
            <div className="timestamp-result">
              <div>
                <strong>Price per square foot:</strong> {pricePerSqft.toFixed(2)}
              </div>
            </div>
          )}
        </>
      )}
      {mode === 'fromRate' && (
        <>
          <div className="tool-controls">
            <label>
              Target price per sq ft:
              <input type="number" min={0} value={targetPricePerSqft} onChange={(e) => setTargetPricePerSqft(e.target.value)} style={{ width: '100px' }} />
            </label>
            <label>
              Known square feet:
              <input type="number" min={0} value={knownSqft} onChange={(e) => setKnownSqft(e.target.value)} style={{ width: '100px' }} />
            </label>
          </div>
          {!error && !fromTargetValid && (
            <div className="tool-error">
              <strong>Error:</strong> Enter a non-negative price/sq ft and a positive square footage.
            </div>
          )}
          {!error && fromTargetValid && (
            <div className="timestamp-result">
              <div>
                <strong>Estimated total price:</strong> {totalFromTarget.toFixed(2)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
