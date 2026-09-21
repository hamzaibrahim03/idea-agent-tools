import { useState } from 'react';
function nowTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
export default function EtaCalculator() {
  const [distance, setDistance] = useState('240');
  const [speed, setSpeed] = useState('60');
  const [startTime, setStartTime] = useState(nowTimeString());
  const distanceNum = Number(distance);
  const speedNum = Number(speed);
  const valid = Number.isFinite(distanceNum) && distanceNum > 0 && Number.isFinite(speedNum) && speedNum > 0 && /^\d{2}:\d{2}$/.test(startTime);
  let travelHours = null;
  let etaLabel = null;
  let dayOffset = 0;
  if (valid) {
    travelHours = distanceNum / speedNum;
    const [h, m] = startTime.split(':').map(Number);
    const startMinutes = h * 60 + m;
    const travelMinutes = Math.round(travelHours * 60);
    const totalMinutes = startMinutes + travelMinutes;
    dayOffset = Math.floor(totalMinutes / 1440);
    const etaMinutesOfDay = ((totalMinutes % 1440) + 1440) % 1440;
    const etaH = Math.floor(etaMinutesOfDay / 60);
    const etaM = etaMinutesOfDay % 60;
    etaLabel = `${String(etaH).padStart(2, '0')}:${String(etaM).padStart(2, '0')}`;
  }
  function formatDuration(hours) {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  }
  return (
    <div className="tool-page">
      <h1>ETA Calculator</h1>
      <p className="tool-description">
        Enter distance, average speed, and a start time to compute travel time and estimated time of
        arrival - correctly rolling over to the next day when travel crosses midnight. Runs entirely
        in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="eta-distance">Distance (miles or km)</label>
          <input id="eta-distance" type="number" min={0} value={distance} onChange={(e) => setDistance(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="eta-speed">Average speed (same unit per hour)</label>
          <input id="eta-speed" type="number" min={0} value={speed} onChange={(e) => setSpeed(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="eta-start">Start time</label>
          <input id="eta-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a positive distance, a positive speed, and a valid start time.
        </div>
      )}
      {valid && (
        <div className="timestamp-result">
          <div>
            <strong>Travel time:</strong> {formatDuration(travelHours)}
          </div>
          <div>
            <strong>ETA:</strong> {etaLabel}
            {dayOffset > 0 ? ` (+${dayOffset} day${dayOffset > 1 ? 's' : ''})` : ''}
          </div>
        </div>
      )}
    </div>
  );
}
