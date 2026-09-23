import { useEffect, useState } from 'react';
export default function FoodCostCalculator() {
    const [ingredients, setIngredients] = useState([
        { id: 1, name: 'Chicken breast', costPerUnit: '4.50', quantity: '0.5' },
        { id: 2, name: 'Rice', costPerUnit: '1.20', quantity: '0.3' }
    ]);
    const [sellingPrice, setSellingPrice] = useState('14.99');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    function updateIngredient(id, field, value) {
        setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    }
    function addIngredient() {
        setIngredients((prev) => [...prev, { id: Date.now(), name: '', costPerUnit: '', quantity: '' }]);
    }
    function removeIngredient(id) {
        setIngredients((prev) => prev.filter((i) => i.id !== id));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/food-cost-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { ingredients, sellingPrice } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) setError(d.error);
                    else setData(d);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [ingredients, sellingPrice]);
    const rows = data?.rows || [];
    const totalFoodCost = data?.totalFoodCost || 0;
    const priceValid = data?.priceValid;
    return (
        <div className="tool-page">
            <h1>Food Cost Calculator</h1>
            <p className="tool-description">
                List a dish's ingredients with cost per unit and quantity used, add the menu selling
                price, and get total food cost, food cost percentage, and gross profit per dish - using
                the standard formula: food cost % = ingredient cost ÷ selling price × 100.
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
            {error && <div className="agent-error">{error}</div>}
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
                        {ingredients.map((ing, idx) => (
                            <tr key={ing.id}>
                                <td>
                                    <input type="text" value={ing.name} onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)} placeholder="e.g. Cheese" style={{ width: '100%' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} step="0.01" value={ing.costPerUnit} onChange={(e) => updateIngredient(ing.id, 'costPerUnit', e.target.value)} style={{ width: '90px' }} />
                                </td>
                                <td>
                                    <input type="number" min={0} step="0.01" value={ing.quantity} onChange={(e) => updateIngredient(ing.id, 'quantity', e.target.value)} style={{ width: '90px' }} />
                                </td>
                                <td>
                                    <code>{rows[idx]?.subtotal !== null && rows[idx]?.subtotal !== undefined ? rows[idx].subtotal.toFixed(2) : '-'}</code>
                                </td>
                                <td>
                                    <button type="button" className="uuid-copy-btn" onClick={() => removeIngredient(ing.id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data && !priceValid && (
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
                        <strong>Food cost %:</strong> {data.foodCostPercent.toFixed(1)}%
                    </div>
                    <div>
                        <strong>Gross profit per dish:</strong> ${data.grossProfit.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
