import { useState } from 'react';
export default function MenuPricingCalculator() {
  const [ingredientCost, setIngredientCost] = useState('4.50');
  const [targetFoodCostPercent, setTargetFoodCostPercent] = useState('30');
  const costNum = Number(ingredientCost);
  const percentNum = Number(targetFoodCostPercent);
  const valid = Number.isFinite(costNum) && costNum > 0 && Number.isFinite(percentNum) && percentNum > 0 && percentNum <= 100;
  const recommendedPrice = valid ? costNum / (percentNum / 100) : null;
  return (
    <div className="tool-page">
      <h1>Menu Pricing Calculator</h1>
      <p className="tool-description">
        Given a dish's ingredient cost and a target food cost percentage (commonly 28-35% in the
        restaurant industry), compute the recommended menu price using the standard formula: price
        = ingredient cost ÷ target food cost %. Runs entirely in your browser.
      </p>
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
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive ingredient cost and a target food cost %
          between 0 and 100.
        </div>
      )}
      {recommendedPrice !== null && (
        <div className="timestamp-result">
          <strong>Recommended menu price:</strong> ${recommendedPrice.toFixed(2)}
        </div>
      )}
    </div>
  );
}
