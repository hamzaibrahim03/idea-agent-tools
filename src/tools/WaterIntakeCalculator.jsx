import { useState } from 'react';
const ACTIVITY_ADJUSTMENTS_OZ = [
  { value: '0', label: 'None (no added exercise)' },
  { value: '12', label: 'Light exercise (< 30 min/day)' },
  { value: '24', label: 'Moderate exercise (30-60 min/day)' },
  { value: '36', label: 'Heavy exercise (> 60 min/day)' },
];
const BASE_OZ_PER_LB = 0.67;
const OZ_PER_ML = 0.033814;
export default function WaterIntakeCalculator() {
  const [unit, setUnit] = useState('lb');
  const [weight, setWeight] = useState('160');
  const [activityAdjustment, setActivityAdjustment] = useState('12');
  const weightNum = Number(weight);
  const activityOz = Number(activityAdjustment);
  const valid = Number.isFinite(weightNum) && weightNum > 0 && Number.isFinite(activityOz) && activityOz >= 0;
  const weightLb = unit === 'lb' ? weightNum : weightNum * 2.20462;
  const totalOz = valid ? weightLb * BASE_OZ_PER_LB + activityOz : null;
  const totalMl = totalOz !== null ? totalOz / OZ_PER_ML : null;
  const totalLiters = totalMl !== null ? totalMl / 1000 : null;
  const totalCups = totalOz !== null ? totalOz / 8 : null;
  return (
    <div className="tool-page">
      <h1>Water Intake Calculator</h1>
      <p className="tool-description">
        Estimate your daily recommended water intake from body weight, using the common guideline
        of roughly two-thirds of an ounce per pound of body weight, with an adjustment for
        exercise. Runs entirely in your browser. This is a general guideline only, not medical
        advice - individual needs vary with climate, health conditions, and activity.
      </p>
      <div className="tool-controls">
        <label>
          Units:
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="lb">Pounds (lb)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </label>
        <label>
          Body weight:
          <input type="number" min={0} value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Activity level:
          <select value={activityAdjustment} onChange={(e) => setActivityAdjustment(e.target.value)}>
            {ACTIVITY_ADJUSTMENTS_OZ.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive body weight.
        </div>
      )}
      {totalOz !== null && (
        <div className="timestamp-result">
          <div>
            <strong>Recommended daily intake:</strong> {totalOz.toFixed(0)} oz
          </div>
          <div>
            <strong>Liters:</strong> {totalLiters.toFixed(2)} L
          </div>
          <div>
            <strong>Cups (8 oz):</strong> {totalCups.toFixed(1)}
          </div>
        </div>
      )}
    </div>
  );
}
