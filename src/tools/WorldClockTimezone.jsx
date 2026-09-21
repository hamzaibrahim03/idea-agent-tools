import { useState, useEffect } from 'react';
const FALLBACK_ZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Sao_Paulo',
  'America/Mexico_City',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Singapore',
  'Australia/Sydney',
  'Australia/Perth',
  'Pacific/Auckland',
];
function getAvailableZones() {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      const zones = Intl.supportedValuesOf('timeZone');
      if (zones && zones.length) return zones;
    }
  } catch {
  }
  return FALLBACK_ZONES;
}
function formatInZone(date, timeZone, options) {
  return new Intl.DateTimeFormat('en-US', { timeZone, ...options }).format(date);
}
export default function WorldClockTimezone() {
  const availableZones = getAvailableZones();
  const [now, setNow] = useState(() => new Date());
  const [zones, setZones] = useState(['America/New_York', 'Asia/Tokyo']);
  const [zoneToAdd, setZoneToAdd] = useState(availableZones[0] || 'UTC');
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const [mode, setMode] = useState('live');
  const [sourceZone, setSourceZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [customDateTime, setCustomDateTime] = useState(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  function handleAddZone() {
    if (zoneToAdd && !zones.includes(zoneToAdd)) {
      setZones((prev) => [...prev, zoneToAdd]);
    }
  }
  function handleRemoveZone(z) {
    setZones((prev) => prev.filter((x) => x !== z));
  }
  function convertCustomDateTime() {
    if (!customDateTime) return null;
    const [datePart, timePart] = customDateTime.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    const naiveUtc = Date.UTC(year, month - 1, day, hour, minute);
    const offsetMs = getZoneOffsetMs(naiveUtc, sourceZone);
    return new Date(naiveUtc - offsetMs);
  }
  function getZoneOffsetMs(utcMs, timeZone) {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = dtf.formatToParts(new Date(utcMs));
    const map = {};
    for (const p of parts) map[p.type] = p.value;
    const hour = map.hour === '24' ? '00' : map.hour;
    const asUtc = Date.UTC(Number(map.year), Number(map.month) - 1, Number(map.day), Number(hour), Number(map.minute), Number(map.second));
    return asUtc - utcMs;
  }
  const convertedDate = mode === 'convert' ? convertCustomDateTime() : null;
  return (
    <div className="tool-page">
      <h1>World Clock & Timezone Converter</h1>
      <p className="tool-description">
        Track the current time across multiple timezones, or convert a specific date/time from one
        timezone to another. Uses your browser's built-in timezone database for accurate results,
        including daylight saving transitions. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="live">Live clocks</option>
            <option value="convert">Convert a specific time</option>
          </select>
        </label>
      </div>
      <div className="tool-controls">
        <label>
          Add timezone:
          <select value={zoneToAdd} onChange={(e) => setZoneToAdd(e.target.value)}>
            {availableZones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleAddZone}>Add</button>
      </div>
      {mode === 'convert' && (
        <div className="tool-controls">
          <label>
            Date/time:
            <input type="datetime-local" value={customDateTime} onChange={(e) => setCustomDateTime(e.target.value)} />
          </label>
          <label>
            Source timezone:
            <select value={sourceZone} onChange={(e) => setSourceZone(e.target.value)}>
              {availableZones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {zones.length === 0 && <div className="tool-error">Add at least one timezone above.</div>}
      <ul className="uuid-list">
        {zones.map((z) => {
          const displayDate = mode === 'convert' ? convertedDate : now;
          const timeStr = displayDate ? formatInZone(displayDate, z, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : '—';
          const dateStr = displayDate ? formatInZone(displayDate, z, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '';
          return (
            <li key={z}>
              <span>
                <strong>{z}</strong>
                <div className="tool-placeholder">{dateStr}</div>
              </span>
              <code style={{ fontSize: 16 }}>{timeStr}</code>
              <button className="uuid-copy-btn" onClick={() => handleRemoveZone(z)} title="Remove this timezone">
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
