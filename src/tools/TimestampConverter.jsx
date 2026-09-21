import { useState, useEffect } from 'react';
function pad(n) {
  return String(n).padStart(2, '0');
}
function toDatetimeLocalValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
export default function TimestampConverter() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState(() => toDatetimeLocalValue(new Date()));
  const [error, setError] = useState('');
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  function parseTimestamp(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    if (!Number.isFinite(num)) throw new Error('Not a valid number.');
    const ms = trimmed.replace(/[.-]/g, '').length >= 13 ? num : num * 1000;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) throw new Error('Out of range for a valid date.');
    return date;
  }
  let parsedDate = null;
  try {
    parsedDate = parseTimestamp(timestampInput);
    if (error) setError('');
  } catch (e) {
    if (timestampInput.trim() && !error) setError(e.message);
  }
  function handleDateChange(value) {
    setDateInput(value);
  }
  const dateToTimestamp = (() => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    return Number.isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000);
  })();
  return (
    <div className="tool-page">
      <h1>Unix Timestamp Converter</h1>
      <p className="tool-description">
        Convert between Unix timestamps and human-readable dates. Automatically detects seconds vs.
        milliseconds. Runs entirely in your browser, using your local timezone.
      </p>
      <div className="tool-panel">
        <label>Current Unix timestamp</label>
        <div className="timestamp-now-row">
          <code>{now}</code>
          <span className="tool-placeholder">{new Date(now * 1000).toString()}</span>
        </div>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ts-input">Timestamp → Date</label>
          <input
            id="ts-input"
            type="text"
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            placeholder="e.g. 1728950400 or 1728950400000"
          />
          {parsedDate && (
            <div className="timestamp-result">
              <div>Local: {parsedDate.toString()}</div>
              <div>UTC: {parsedDate.toUTCString()}</div>
              <div>ISO 8601: {parsedDate.toISOString()}</div>
            </div>
          )}
          {error && (
            <div className="tool-error">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        <div className="tool-panel">
          <label htmlFor="date-input">Date → Timestamp</label>
          <input id="date-input" type="datetime-local" step="1" value={dateInput} onChange={(e) => handleDateChange(e.target.value)} />
          {dateToTimestamp !== null && (
            <div className="timestamp-result">
              <div>Seconds: <code>{dateToTimestamp}</code></div>
              <div>Milliseconds: <code>{dateToTimestamp * 1000}</code></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
