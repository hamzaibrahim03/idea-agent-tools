import { useState } from 'react';
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);
const SYNODIC_MONTH_DAYS = 29.53058867;
const PHASES = [
  { name: 'New Moon', max: 0.02 },
  { name: 'Waxing Crescent', max: 0.25 },
  { name: 'First Quarter', max: 0.27 },
  { name: 'Waxing Gibbous', max: 0.48 },
  { name: 'Full Moon', max: 0.52 },
  { name: 'Waning Gibbous', max: 0.73 },
  { name: 'Last Quarter', max: 0.75 },
  { name: 'Waning Crescent', max: 0.98 },
  { name: 'New Moon', max: 1.01 }
];
function calculateMoonPhase(dateStr) {
  const date = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  const daysSinceReference = (date.getTime() - REFERENCE_NEW_MOON) / 86400000;
  const cyclesElapsed = daysSinceReference / SYNODIC_MONTH_DAYS;
  const age = (cyclesElapsed - Math.floor(cyclesElapsed)) * SYNODIC_MONTH_DAYS;
  const fraction = age / SYNODIC_MONTH_DAYS;
  const phase = PHASES.find((p) => fraction <= p.max) || PHASES[PHASES.length - 1];
  const illumination = Math.round((1 - Math.cos(fraction * 2 * Math.PI)) * 50);
  return { age, phaseName: phase.name, illumination };
}
const todayStr = () => new Date().toISOString().slice(0, 10);
export default function MoonPhaseCalculator() {
  const [date, setDate] = useState(todayStr());
  const result = calculateMoonPhase(date);
  return (
    <div className="tool-page">
      <h1>Moon Phase Calculator</h1>
      <p className="tool-description">
        Estimate the moon phase and illumination percentage for any date, using a standard
        synodic-month formula. This is an approximation - it does not account for orbital
        eccentricity or other fine astronomical corrections. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button onClick={() => setDate(todayStr())}>Today</button>
      </div>
      {!result && <div className="tool-error">Please enter a valid date.</div>}
      {result && (
        <div className="timestamp-result">
          <span>
            <strong>Phase:</strong> {result.phaseName}
          </span>
          <span>
            <strong>Illumination:</strong> ~{result.illumination}%
          </span>
          <span>
            <strong>Moon age:</strong> ~{result.age.toFixed(1)} days into the cycle
          </span>
        </div>
      )}
    </div>
  );
}
