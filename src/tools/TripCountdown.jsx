import { useState, useEffect } from 'react';
function pad(n) {
  return String(n).padStart(2, '0');
}
function breakdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}
function defaultTarget() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`;
}
export default function TripCountdown() {
  const [destination, setDestination] = useState('');
  const [targetInput, setTargetInput] = useState(defaultTarget());
  const [activeTarget, setActiveTarget] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!activeTarget) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [activeTarget]);
  function handleStart() {
    const target = new Date(targetInput);
    if (Number.isNaN(target.getTime())) return;
    setActiveTarget(target.getTime());
    setNow(Date.now());
  }
  function handleClear() {
    setActiveTarget(null);
  }
  const remainingMs = activeTarget ? activeTarget - now : null;
  const isPast = remainingMs !== null && remainingMs <= 0;
  const parts = remainingMs !== null ? breakdown(remainingMs) : null;
  return (
    <div className="tool-page">
      <h1>Trip Countdown</h1>
      <p className="tool-description">
        Set your trip's departure date and time to see a live countdown in days, hours, minutes,
        and seconds until you leave. Timing is based on real elapsed wall-clock time. Runs entirely
        in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Trip name (optional):
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Trip to Japan"
            style={{ width: '180px' }}
          />
        </label>
        <label>
          Departure date/time:
          <input type="datetime-local" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} />
        </label>
        <button onClick={handleStart}>Start countdown</button>
        <button onClick={handleClear} disabled={!activeTarget}>Clear</button>
      </div>
      {activeTarget && parts && (
        <div className="timestamp-result">
          {destination && (
            <span>
              <strong>{destination}</strong>
            </span>
          )}
          {isPast ? (
            <strong>Departure time has arrived!</strong>
          ) : (
            <code style={{ fontSize: 24 }}>
              {parts.days}d {pad(parts.hours)}h {pad(parts.minutes)}m {pad(parts.seconds)}s
            </code>
          )}
          <span>
            <strong>Departure:</strong> {new Date(activeTarget).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
