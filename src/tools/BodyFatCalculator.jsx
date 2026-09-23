import { useState } from 'react';
function navyBodyFat(sex, heightCm, neckCm, waistCm, hipCm) {
  if (sex === 'male') {
    if (waistCm - neckCm <= 0) return null;
    return 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  }
  if (waistCm + hipCm - neckCm <= 0) return null;
  return 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) - 450;
}
export default function BodyFatCalculator() {
  const [sex, setSex] = useState('male');
  const [heightCm, setHeightCm] = useState('175');
  const [neckCm, setNeckCm] = useState('38');
  const [waistCm, setWaistCm] = useState('85');
  const [hipCm, setHipCm] = useState('95');
  const heightNum = Number(heightCm);
  const neckNum = Number(neckCm);
  const waistNum = Number(waistCm);
  const hipNum = Number(hipCm);
  const valid =
    Number.isFinite(heightNum) && heightNum > 0 &&
    Number.isFinite(neckNum) && neckNum > 0 &&
    Number.isFinite(waistNum) && waistNum > 0 &&
    (sex === 'male' || (Number.isFinite(hipNum) && hipNum > 0));
  const bodyFat = valid ? navyBodyFat(sex, heightNum, neckNum, waistNum, hipNum) : null;
  return (
    <div className="tool-page">
      <h1>Body Fat Calculator</h1>
      <p className="tool-description">
        Estimate body fat percentage using the US Navy circumference method, based on height,
        neck, and waist measurements (plus hip for females). Runs entirely in your browser. This
        is an estimate only, not a medical measurement - for an accurate reading, consult a
        healthcare professional or use a clinical body composition test.
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
          Height (cm):
          <input type="number" min={0} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Neck (cm):
          <input type="number" min={0} value={neckCm} onChange={(e) => setNeckCm(e.target.value)} style={{ width: '90px' }} />
        </label>
        <label>
          Waist (cm):
          <input type="number" min={0} value={waistCm} onChange={(e) => setWaistCm(e.target.value)} style={{ width: '90px' }} />
        </label>
        {sex === 'female' && (
          <label>
            Hip (cm):
            <input type="number" min={0} value={hipCm} onChange={(e) => setHipCm(e.target.value)} style={{ width: '90px' }} />
          </label>
        )}
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter positive measurements for all required fields (waist must be greater than neck).
        </div>
      )}
      {valid && bodyFat === null && (
        <div className="tool-error">
          <strong>Error:</strong> These measurements produce an invalid result - double-check waist, neck, and hip values.
        </div>
      )}
      {bodyFat !== null && (
        <div className="timestamp-result">
          <strong>Estimated body fat:</strong> {bodyFat.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
