import { useState } from 'react';
export default function PricePerSquareFootCalculator() {
  const [mode, setMode] = useState('fromPrice');
  const [totalPrice, setTotalPrice] = useState('300000');
  const [totalSqft, setTotalSqft] = useState('1500');
  const [targetPricePerSqft, setTargetPricePerSqft] = useState('200');
  const [knownSqft, setKnownSqft] = useState('1500');
  const priceNum = Number(totalPrice);
  const sqftNum = Number(totalSqft);
  const fromPriceValid = Number.isFinite(priceNum) && priceNum >= 0 && Number.isFinite(sqftNum) && sqftNum > 0;
  const pricePerSqft = fromPriceValid ? priceNum / sqftNum : null;
  const targetNum = Number(targetPricePerSqft);
  const knownSqftNum = Number(knownSqft);
  const fromTargetValid = Number.isFinite(targetNum) && targetNum >= 0 && Number.isFinite(knownSqftNum) && knownSqftNum > 0;
  const totalFromTarget = fromTargetValid ? targetNum * knownSqftNum : null;
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
          {!fromPriceValid && (
            <div className="tool-error">
              <strong>Error:</strong> Enter a non-negative price and a positive square footage.
            </div>
          )}
          {fromPriceValid && (
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
          {!fromTargetValid && (
            <div className="tool-error">
              <strong>Error:</strong> Enter a non-negative price/sq ft and a positive square footage.
            </div>
          )}
          {fromTargetValid && (
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
