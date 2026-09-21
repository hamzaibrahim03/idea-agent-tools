import { useMemo, useState } from 'react';
function calculate(carts, purchases) {
  if (carts <= 0) return null;
  const abandoned = Math.max(carts - purchases, 0);
  const rate = (abandoned / carts) * 100;
  return { abandoned, rate };
}
const BENCHMARK_LOW = 65;
const BENCHMARK_HIGH = 70;
export default function CartAbandonmentRateCalculator() {
  const [carts, setCarts] = useState('1000');
  const [purchases, setPurchases] = useState('300');
  const cartsNum = parseFloat(carts) || 0;
  const purchasesNum = parseFloat(purchases) || 0;
  const result = useMemo(() => calculate(cartsNum, purchasesNum), [cartsNum, purchasesNum]);
  return (
    <div className="tool-page">
      <h1>Cart Abandonment Rate Calculator</h1>
      <p className="tool-description">
        Enter the number of carts created and the number of completed purchases to calculate your
        cart abandonment rate. Also shows a commonly-cited industry reference range for context -
        this is a general figure from widely-cited industry studies, not a guarantee or live
        benchmark. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ca-carts">Carts created</label>
          <input id="ca-carts" type="number" min={0} step="1" value={carts} onChange={(e) => setCarts(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ca-purchases">Completed purchases</label>
          <input id="ca-purchases" type="number" min={0} step="1" value={purchases} onChange={(e) => setPurchases(e.target.value)} />
        </div>
      </div>
      {!result ? (
        <div className="tool-error">Enter a number of carts created greater than 0.</div>
      ) : (
        <div className="timestamp-result">
          <span>
            <strong>Abandoned carts:</strong> {result.abandoned}
          </span>
          <span>
            <strong>Cart abandonment rate:</strong> {result.rate.toFixed(1)}%
          </span>
          <span>
            <strong>Industry reference:</strong> commonly cited e-commerce abandonment rates fall
            around {BENCHMARK_LOW}-{BENCHMARK_HIGH}% (general reference figure, not a guarantee)
          </span>
        </div>
      )}
    </div>
  );
}
