import { useState } from 'react';
export default function FoodCostCalculator() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Chicken breast', costPerUnit: '4.50', quantity: '0.5' },
    { id: 2, name: 'Rice', costPerUnit: '1.20', quantity: '0.3' }
  ]);
  const [sellingPrice, setSellingPrice] = useState('14.99');
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
  const totalFoodCost = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);
  const priceNum = Number(sellingPrice);
  const priceValid = Number.isFinite(priceNum) && priceNum > 0;
  const foodCostPercent = priceValid ? (totalFoodCost / priceNum) * 100 : null;
  const grossProfit = priceValid ? priceNum - totalFoodCost : null;
  return (
    <div className="tool-page">
      <h1>Food Cost Calculator</h1>
      <p className="tool-description">
        List a dish's ingredients with cost per unit and quantity used, add the menu selling
        price, and get total food cost, food cost percentage, and gross profit per dish - using
        the standard formula: food cost % = ingredient cost ÷ selling price × 100. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Menu selling price ($):
          <input type="number" min={0} step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} style={{ width: '100px' }} />
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
                  <input type="text" value={r.name} onChange={(e) => updateIngredient(r.id, 'name', e.target.value)} placeholder="e.g. Cheese" style={{ width: '100%' }} />
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
      {!priceValid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive menu selling price.
        </div>
      )}
      {priceValid && (
        <div className="timestamp-result">
          <div>
            <strong>Total food cost:</strong> ${totalFoodCost.toFixed(2)}
          </div>
          <div>
            <strong>Food cost %:</strong> {foodCostPercent.toFixed(1)}%
          </div>
          <div>
            <strong>Gross profit per dish:</strong> ${grossProfit.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
