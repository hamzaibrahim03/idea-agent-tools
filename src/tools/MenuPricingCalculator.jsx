import { useEffect, useState } from 'react';
export default function MenuPricingCalculator() {
  const [ingredientCost, setIngredientCost] = useState('4.50');
  const [targetFoodCostPercent, setTargetFoodCostPercent] = useState('30');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/menu-pricing-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { ingredientCost, targetFoodCostPercent } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setResult(null);
          } else {
            setError('');
            setResult(data);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [ingredientCost, targetFoodCostPercent]);
  return (
    <div className="tool-page">
      <h1>Menu Pricing Calculator</h1>
      <p className="tool-description">
        Given a dish's ingredient cost and a target food cost percentage (commonly 28-35% in the
        restaurant industry), compute the recommended menu price using the standard formula: price
        = ingredient cost ÷ target food cost %.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="mp-cost">Ingredient cost per dish ($)</label>
          <input id="mp-cost" type="number" min={0} step="0.01" value={ingredientCost} onChange={(e) => setIngredientCost(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="mp-target">Target food cost % (typically 28-35%)</label>
          <input id="mp-target" type="number" min={0} max={100} step="0.1" value={targetFoodCostPercent} onChange={(e) => setTargetFoodCostPercent(e.target.value)} />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && !error && (
        <div className="timestamp-result">
          <strong>Recommended menu price:</strong> ${result.recommendedPrice.toFixed(2)}
        </div>
      )}
    </div>
  );
}
