import { useState } from 'react';
export default function FuelCostCalculator() {
  const [unit, setUnit] = useState('mpg');
  const [distance, setDistance] = useState('300');
  const [efficiency, setEfficiency] = useState('25');
  const [price, setPrice] = useState('3.50');
  const distanceNum = Number(distance);
  const efficiencyNum = Number(efficiency);
  const priceNum = Number(price);
  const valid =
    Number.isFinite(distanceNum) && distanceNum > 0 &&
    Number.isFinite(efficiencyNum) && efficiencyNum > 0 &&
    Number.isFinite(priceNum) && priceNum >= 0;
  let fuelUsed = null;
  let totalCost = null;
  if (valid) {
    if (unit === 'mpg') {
      fuelUsed = distanceNum / efficiencyNum;
    } else {
      fuelUsed = (distanceNum / 100) * efficiencyNum;
    }
    totalCost = fuelUsed * priceNum;
  }
  return (
    <div className="tool-page">
      <h1>Fuel Cost Calculator</h1>
      <p className="tool-description">
        Enter your trip distance, vehicle fuel efficiency, and your local fuel price (this site has no
        live fuel price data, so enter your own price per gallon or liter) to compute the total fuel
        cost for the trip. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Efficiency unit:
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="mpg">Miles per gallon (mpg)</option>
            <option value="l100km">Liters per 100 km</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="fc-distance">Trip distance ({unit === 'mpg' ? 'miles' : 'km'})</label>
          <input id="fc-distance" type="number" min={0} value={distance} onChange={(e) => setDistance(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="fc-efficiency">
            Fuel efficiency ({unit === 'mpg' ? 'mpg' : 'L/100km'})
          </label>
          <input id="fc-efficiency" type="number" min={0} step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="fc-price">
            Fuel price (per {unit === 'mpg' ? 'gallon' : 'liter'}) - enter your local price
          </label>
          <input id="fc-price" type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive distance, a positive fuel efficiency, and a non-negative fuel price.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Fuel used:</strong> {fuelUsed.toFixed(2)} {unit === 'mpg' ? 'gallons' : 'liters'}
          </div>
          <div>
            <strong>Total fuel cost:</strong> ${totalCost.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
