import { useState } from 'react';
const ACTIVITY_FACTORS = [
  { value: '1.2', label: 'Sedentary (little or no exercise)' },
  { value: '1.375', label: 'Lightly active (light exercise 1-3 days/week)' },
  { value: '1.55', label: 'Moderately active (moderate exercise 3-5 days/week)' },
  { value: '1.725', label: 'Very active (hard exercise 6-7 days/week)' },
  { value: '1.9', label: 'Extra active (very hard exercise & physical job)' },
];
function mifflinStJeor(sex, weightKg, heightCm, age) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}
export default function CalorieNeedsCalculator() {
  const [sex, setSex] = useState('male');
  const [age, setAge] = useState('30');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('75');
  const [activityFactor, setActivityFactor] = useState('1.55');
  const ageNum = Number(age);
  const heightNum = Number(heightCm);
  const weightNum = Number(weightKg);
  const activityNum = Number(activityFactor);
  const valid =
    Number.isFinite(ageNum) && ageNum > 0 &&
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(weightNum) && weightNum > 0 &&
    Number.isFinite(activityNum) && activityNum > 0;
  const bmr = valid ? mifflinStJeor(sex, weightNum, heightNum, ageNum) : null;
  const tdee = bmr !== null ? bmr * activityNum : null;
  return (
    <div className="tool-page">
      <h1>Calorie Needs Calculator</h1>
      <p className="tool-description">
        Estimate your basal metabolic rate (BMR) using the Mifflin-St Jeor equation, then apply an
        activity multiplier to estimate total daily energy expenditure (TDEE) - the calories
        needed to maintain your current weight. Runs entirely in your browser. This is an
        estimate only, not medical advice - consult a healthcare professional for individual
        dietary guidance.
      </p>
      <div className="tool-controls">
        <label>
          Sex:
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Age:
          <input type="number" min={0} value={age} onChange={(e) => setAge(e.target.value)} style={{ width: '70px' }} />
        </label>
        <label>
          Height (cm):
          <input type="number" min={0} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Weight (kg):
          <input type="number" min={0} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} style={{ width: '90px' }} />
        </label>
      </div>
      <div className="tool-controls">
        <label>
          Activity level:
          <select value={activityFactor} onChange={(e) => setActivityFactor(e.target.value)}>
            {ACTIVITY_FACTORS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive values for age, height, and weight.
        </div>
      )}
      {bmr !== null && (
        <div className="timestamp-result">
          <div>
            <strong>BMR (basal metabolic rate):</strong> {bmr.toFixed(0)} calories/day
          </div>
          <div>
            <strong>TDEE (estimated daily needs):</strong> {tdee.toFixed(0)} calories/day
          </div>
        </div>
      )}
    </div>
  );
}
