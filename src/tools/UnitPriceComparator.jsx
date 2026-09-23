import { useEffect, useState } from 'react';
export default function UnitPriceComparator() {
  const [priceA, setPriceA] = useState('5');
  const [qtyA, setQtyA] = useState('12');
  const [labelA, setLabelA] = useState('Product A');
  const [priceB, setPriceB] = useState('8');
  const [qtyB, setQtyB] = useState('20');
  const [labelB, setLabelB] = useState('Product B');
  const [unit, setUnit] = useState('oz');
  const [result, setResult] = useState({ perUnitA: null, perUnitB: null, winner: null, savingsPct: null });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/unit-price-comparator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { priceA, qtyA, priceB, qtyB } })
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
  }, [priceA, qtyA, priceB, qtyB]);
  const { perUnitA, perUnitB, winner, savingsPct } = result;
  return (
    <div className="tool-page">
      <h1>Unit Price Comparator</h1>
      <p className="tool-description">
        Compare two products by price and quantity (e.g. "$5 for 12oz" vs "$8 for 20oz") to see
        which one is the better deal per unit. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <label>
          Unit label:
          <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: '80px' }} />
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel" style={{ marginBottom: 0 }}>
          <label htmlFor="product-a-label">Name</label>
          <input id="product-a-label" type="text" value={labelA} onChange={(e) => setLabelA(e.target.value)} />
          <div className="tool-controls" style={{ marginBottom: 0, marginTop: 8 }}>
            <label>
              Price ($):
              <input
                type="number"
                min={0}
                step="0.01"
                value={priceA}
                onChange={(e) => setPriceA(e.target.value)}
                style={{ width: '90px' }}
              />
            </label>
            <label>
              Quantity ({unit || 'unit'}):
              <input
                type="number"
                min={0}
                step="0.01"
                value={qtyA}
                onChange={(e) => setQtyA(e.target.value)}
                style={{ width: '90px' }}
              />
            </label>
          </div>
        </div>
        <div className="tool-panel" style={{ marginBottom: 0 }}>
          <label htmlFor="product-b-label">Name</label>
          <input id="product-b-label" type="text" value={labelB} onChange={(e) => setLabelB(e.target.value)} />
          <div className="tool-controls" style={{ marginBottom: 0, marginTop: 8 }}>
            <label>
              Price ($):
              <input
                type="number"
                min={0}
                step="0.01"
                value={priceB}
                onChange={(e) => setPriceB(e.target.value)}
                style={{ width: '90px' }}
              />
            </label>
            <label>
              Quantity ({unit || 'unit'}):
              <input
                type="number"
                min={0}
                step="0.01"
                value={qtyB}
                onChange={(e) => setQtyB(e.target.value)}
                style={{ width: '90px' }}
              />
            </label>
          </div>
        </div>
      </div>
      {(perUnitA === null || perUnitB === null) && (
        <div className="tool-error">Enter a positive price and quantity for both products.</div>
      )}
      {perUnitA !== null && perUnitB !== null && (
        <div className="timestamp-result">
          <span>
            <strong>{labelA || 'Product A'}:</strong> ${perUnitA.toFixed(4)} per {unit || 'unit'}
          </span>
          <span>
            <strong>{labelB || 'Product B'}:</strong> ${perUnitB.toFixed(4)} per {unit || 'unit'}
          </span>
          <span>
            {winner === 'tie' ? (
              <strong>Both are the same price per unit.</strong>
            ) : (
              <>
                <strong>{winner === 'A' ? labelA || 'Product A' : labelB || 'Product B'} is the better deal</strong>
                {savingsPct !== null && ` - about ${savingsPct.toFixed(1)}% cheaper per ${unit || 'unit'}.`}
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
