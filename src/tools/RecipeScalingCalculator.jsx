import { useEffect, useState } from 'react';
export default function RecipeScalingCalculator() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Flour (cups)', quantity: '2' },
    { id: 2, name: 'Sugar (cups)', quantity: '1' },
    { id: 3, name: 'Eggs', quantity: '3' }
  ]);
  const [originalServings, setOriginalServings] = useState('4');
  const [targetServings, setTargetServings] = useState('10');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  function updateIngredient(id, field, value) {
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }
  function addIngredient() {
    setIngredients((prev) => [...prev, { id: Date.now(), name: '', quantity: '' }]);
  }
  function removeIngredient(id) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/recipe-scaling-calculator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { ingredients, originalServings, targetServings } })
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
  }, [ingredients, originalServings, targetServings]);
  const rows = result?.rows ?? ingredients.map((i) => ({ ...i, scaled: null }));
  const servingsValid = result?.servingsValid ?? false;
  const scaleFactor = result?.scaleFactor ?? null;
  return (
    <div className="tool-page">
      <h1>Recipe Scaling Calculator</h1>
      <p className="tool-description">
        Enter a recipe's original ingredient list and serving count, plus a target serving count,
        to get each ingredient's scaled quantity using simple ratio scaling. Runs entirely in your
        browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="rs-original">Original servings</label>
          <input id="rs-original" type="number" min={0} value={originalServings} onChange={(e) => setOriginalServings(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="rs-target">Target servings</label>
          <input id="rs-target" type="number" min={0} value={targetServings} onChange={(e) => setTargetServings(e.target.value)} />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addIngredient}>
          Add ingredient
        </button>
        {scaleFactor !== null && (
          <span>
            <strong>Scale factor:</strong> {scaleFactor.toFixed(3)}×
          </span>
        )}
      </div>
      {!servingsValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive original and target serving counts.
        </div>
      )}
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Original quantity</th>
              <th>Scaled quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <input type="text" value={r.name} onChange={(e) => updateIngredient(r.id, 'name', e.target.value)} placeholder="e.g. Butter (tbsp)" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={r.quantity} onChange={(e) => updateIngredient(r.id, 'quantity', e.target.value)} style={{ width: '100px' }} />
                </td>
                <td>
                  <code>{r.scaled !== null && r.scaled !== undefined ? Number(r.scaled.toFixed(3)) : '-'}</code>
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeIngredient(r.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
