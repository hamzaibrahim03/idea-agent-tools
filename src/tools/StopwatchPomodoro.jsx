import { useState, useEffect, useRef } from 'react';
function formatElapsed(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSeconds = Math.floor(totalCs / 100);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}
function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setElapsed(baseRef.current + (Date.now() - startRef.current));
    }, 50);
    return () => clearInterval(id);
  }, [running]);
  function handleStart() {
    startRef.current = Date.now();
    setRunning(true);
  }
  function handlePause() {
    baseRef.current = baseRef.current + (Date.now() - startRef.current);
    setElapsed(baseRef.current);
    setRunning(false);
  }
  function handleReset() {
    setRunning(false);
    baseRef.current = 0;
    setElapsed(0);
    setLaps([]);
  }
  function handleLap() {
    const current = running ? baseRef.current + (Date.now() - startRef.current) : elapsed;
    setLaps((prev) => [...prev, current]);
  }
  return (
    <div>
      <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Stopwatch</h2>
      <div className="timestamp-now-row">
        <code style={{ fontSize: 24 }}>{formatElapsed(elapsed)}</code>
      </div>
      <div className="tool-controls">
        {!running ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handlePause}>Pause</button>
        )}
        <button onClick={handleLap} disabled={!running && elapsed === 0}>
          Lap
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
      {laps.length > 0 && (
        <ul className="uuid-list">
          {laps.map((lap, i) => (
            <li key={i}>
              <span>Lap {i + 1}</span>
              <code>{formatElapsed(lap)}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function Pomodoro() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [phase, setPhase] = useState('work');
  const [running, setRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(25 * 60 * 1000);
  const startRef = useRef(0);
  const baseRemainingRef = useRef(25 * 60 * 1000);
  const phaseRef = useRef('work');
  phaseRef.current = phase;
  function phaseDurationMs(p) {
    return (p === 'work' ? workMinutes : breakMinutes) * 60 * 1000;
  }
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      const remaining = baseRemainingRef.current - (Date.now() - startRef.current);
      if (remaining <= 0) {
        const nextPhase = phaseRef.current === 'work' ? 'break' : 'work';
        setPhase(nextPhase);
        baseRemainingRef.current = phaseDurationMs(nextPhase);
        startRef.current = Date.now();
        setRemainingMs(baseRemainingRef.current);
      } else {
        setRemainingMs(remaining);
      }
    }, 250);
    return () => clearInterval(id);
  }, [running, workMinutes, breakMinutes]);
  function handleStart() {
    startRef.current = Date.now();
    setRunning(true);
  }
  function handlePause() {
    baseRemainingRef.current = baseRemainingRef.current - (Date.now() - startRef.current);
    setRemainingMs(baseRemainingRef.current);
    setRunning(false);
  }
  function handleReset() {
    setRunning(false);
    setPhase('work');
    baseRemainingRef.current = workMinutes * 60 * 1000;
    setRemainingMs(baseRemainingRef.current);
  }
  function handleWorkChange(value) {
    setWorkMinutes(value);
    if (!running && phase === 'work') {
      baseRemainingRef.current = value * 60 * 1000;
      setRemainingMs(baseRemainingRef.current);
    }
  }
  function handleBreakChange(value) {
    setBreakMinutes(value);
    if (!running && phase === 'break') {
      baseRemainingRef.current = value * 60 * 1000;
      setRemainingMs(baseRemainingRef.current);
    }
  }
  return (
    <div>
      <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Pomodoro Timer</h2>
      <div className="tool-controls">
        <label>
          Work (min):
          <input
            type="number"
            min={1}
            value={workMinutes}
            onChange={(e) => handleWorkChange(Number(e.target.value) || 1)}
            disabled={running}
            style={{ width: '70px' }}
          />
        </label>
        <label>
          Break (min):
          <input
            type="number"
            min={1}
            value={breakMinutes}
            onChange={(e) => handleBreakChange(Number(e.target.value) || 1)}
            disabled={running}
            style={{ width: '70px' }}
          />
        </label>
      </div>
      <div className="timestamp-now-row">
        <span>
          <strong>{phase === 'work' ? 'Work' : 'Break'}</strong>
        </span>
        <code style={{ fontSize: 24 }}>{formatCountdown(remainingMs)}</code>
      </div>
      <div className="tool-controls">
        {!running ? <button onClick={handleStart}>Start</button> : <button onClick={handlePause}>Pause</button>}
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
export default function StopwatchPomodoro() {
  return (
    <div className="tool-page">
      <h1>Stopwatch & Pomodoro Timer</h1>
      <p className="tool-description">
        A stopwatch with lap tracking, and a configurable Pomodoro work/break timer. Runs entirely
        in your browser - timing is based on real elapsed wall-clock time, so it stays accurate
        even if the tab is backgrounded.
      </p>
      <Stopwatch />
      <div style={{ marginTop: 32 }}>
        <Pomodoro />
      </div>
    </div>
  );
}
