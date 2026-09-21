import { useState, useEffect, useRef } from 'react';
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  return h > 0
    ? `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
    : `${m}m ${String(s).padStart(2, '0')}s`;
}
export default function StudyTimer() {
  const [subject, setSubject] = useState('');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessions, setSessions] = useState([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setElapsed(baseRef.current + (Date.now() - startRef.current));
    }, 500);
    return () => clearInterval(id);
  }, [running]);
  function handleStart() {
    startRef.current = Date.now();
    setRunning(true);
  }
  function handleStop() {
    const finalElapsed = baseRef.current + (Date.now() - startRef.current);
    setRunning(false);
    if (finalElapsed > 0) {
      setSessions((prev) => [{ subject: subject.trim() || 'Untitled', durationMs: finalElapsed, endedAt: new Date() }, ...prev]);
    }
    baseRef.current = 0;
    setElapsed(0);
  }
  const totalTodayMs = sessions
    .filter((s) => s.endedAt.toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.durationMs, 0);
  const bySubject = [];
  for (const s of sessions) {
    const existing = bySubject.find((e) => e.subject === s.subject);
    if (existing) existing.totalMs += s.durationMs;
    else bySubject.push({ subject: s.subject, totalMs: s.durationMs });
  }
  return (
    <div className="tool-page">
      <h1>Study Timer</h1>
      <p className="tool-description">
        Track study sessions by subject, with a running log and per-subject totals. Runs entirely
        in your browser - sessions are lost on page refresh, so copy your log elsewhere if you
        need to keep it.
      </p>
      <div className="tool-controls">
        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Calculus"
            disabled={running}
            style={{ width: '160px' }}
          />
        </label>
        {!running ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop &amp; log session</button>
        )}
      </div>
      <div className="timestamp-now-row">
        <code style={{ fontSize: 22 }}>{formatDuration(elapsed)}</code>
      </div>
      <div className="timestamp-result" style={{ marginTop: 16 }}>
        <div>
          <strong>Studied today:</strong> {formatDuration(totalTodayMs)}
        </div>
      </div>
      {bySubject.length > 0 && (
        <div className="tool-panel" style={{ marginTop: 16 }}>
          <label>Totals by subject</label>
          <ul className="uuid-list">
            {bySubject.map((s) => (
              <li key={s.subject}>
                <span>{s.subject}</span>
                <code>{formatDuration(s.totalMs)}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
      {sessions.length > 0 && (
        <div className="tool-panel" style={{ marginTop: 16 }}>
          <label>Session log</label>
          <ul className="uuid-list">
            {sessions.map((s, i) => (
              <li key={i}>
                <span>
                  {s.subject} - {s.endedAt.toLocaleTimeString()}
                </span>
                <code>{formatDuration(s.durationMs)}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
