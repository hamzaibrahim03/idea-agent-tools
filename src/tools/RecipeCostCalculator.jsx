import { useState } from 'react';
export default function RecipeCostCalculator() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Flour', costPerUnit: '0.80', quantity: '5' },
    { id: 2, name: 'Sugar', costPerUnit: '1.10', quantity: '2' },
    { id: 3, name: 'Butter', costPerUnit: '5.00', quantity: '1' }
  ]);
  const [servings, setServings] = useState('12');
  function updateIngredient(id, field, value) {
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }
  function addIngredient() {
    setIngredients((prev) => [...prev, { id: Date.now(), name: '', costPerUnit: '', quantity: '' }]);
  }
  function removeIngredient(id) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }
  const rows = ingredients.map((i) => {
    const cost = Number(i.costPerUnit);
    const qty = Number(i.quantity);
    const valid = Number.isFinite(cost) && cost >= 0 && Number.isFinite(qty) && qty >= 0;
    return { ...i, subtotal: valid ? cost * qty : null };
  });
  const totalRecipeCost = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);
  const servingsNum = Number(servings);
  const servingsValid = Number.isFinite(servingsNum) && servingsNum > 0;
  const costPerServing = servingsValid ? totalRecipeCost / servingsNum : null;
  return (
    <div className="tool-page">
      <h1>Recipe Cost Calculator</h1>
      <p className="tool-description">
        List all ingredients (cost per unit × quantity) for a full recipe batch, enter the number
        of servings it yields, and get the total recipe cost and cost per serving. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Servings yielded:
          <input type="number" min={1} value={servings} onChange={(e) => setServings(e.target.value)} style={{ width: '80px' }} />
        </label>
        <button type="button" onClick={addIngredient}>
          Add ingredient
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Cost per unit ($)</th>
              <th>Quantity used</th>
              <th>Subtotal ($)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <input type="text" value={r.name} onChange={(e) => updateIngredient(r.id, 'name', e.target.value)} placeholder="e.g. Eggs" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={r.costPerUnit} onChange={(e) => updateIngredient(r.id, 'costPerUnit', e.target.value)} style={{ width: '90px' }} />
                </td>
                <td>
                  <input type="number" min={0} step="0.01" value={r.quantity} onChange={(e) => updateIngredient(r.id, 'quantity', e.target.value)} style={{ width: '90px' }} />
                </td>
                <td>
                  <code>{r.subtotal !== null ? r.subtotal.toFixed(2) : '-'}</code>
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
      {!servingsValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive number of servings.
        </div>
      )}
      {servingsValid && (
        <div className="timestamp-result">
          <div>
            <strong>Total recipe cost:</strong> ${totalRecipeCost.toFixed(2)}
          </div>
          <div>
            <strong>Cost per serving:</strong> ${costPerServing.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
