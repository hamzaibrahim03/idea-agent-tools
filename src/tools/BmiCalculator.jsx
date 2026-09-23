import { useState } from 'react';
function bmiCategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
export default function BmiCalculator() {
  const [unit, setUnit] = useState('metric');
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLb, setWeightLb] = useState('154');
  const bmi = (() => {
    if (unit === 'metric') {
      const h = Number(heightCm) / 100;
      const w = Number(weightKg);
      if (!h || !w) return null;
      return w / (h * h);
    }
    const totalInches = Number(heightFt) * 12 + Number(heightIn);
    const w = Number(weightLb);
    if (!totalInches || !w) return null;
    return (w / (totalInches * totalInches)) * 703;
  })();
  return (
    <div className="tool-page">
      <h1>BMI Calculator</h1>
      <p className="tool-description">
        Calculate Body Mass Index from height and weight. Runs entirely in your browser. For
        informational purposes only - not medical advice.
      </p>
      <div className="tool-controls">
        <label>
          Units:
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="metric">Metric (cm, kg)</option>
            <option value="imperial">Imperial (ft/in, lb)</option>
          </select>
        </label>
      </div>
      {unit === 'metric' ? (
        <div className="tool-controls">
          <label>
            Height (cm):
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} style={{ width: '90px' }} />
          </label>
          <label>
            Weight (kg):
            <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} style={{ width: '90px' }} />
          </label>
        </div>
      ) : (
        <div className="tool-controls">
          <label>
            Height (ft):
            <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} style={{ width: '70px' }} />
          </label>
          <label>
            (in):
            <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} style={{ width: '70px' }} />
          </label>
          <label>
            Weight (lb):
            <input type="number" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} style={{ width: '90px' }} />
          </label>
        </div>
      )}
      {bmi !== null && (
        <div className="timestamp-result">
          <span>
            <strong>BMI:</strong> {bmi.toFixed(1)}
          </span>
          <span>
            <strong>Category:</strong> {bmiCategory(bmi)}
          </span>
        </div>
      )}
    </div>
  );
}
