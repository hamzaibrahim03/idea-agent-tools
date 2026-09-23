import { useEffect, useState } from 'react';
const FALLBACK_ZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland'
];
export default function TimeZoneMeetingPlanner() {
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const [zones, setZones] = useState(() => {
    const defaults = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
    return defaults.includes(localZone) ? defaults : [localZone, ...defaults];
  });
  const [availableZones, setAvailableZones] = useState(FALLBACK_ZONES);
  const [zoneToAdd, setZoneToAdd] = useState(FALLBACK_ZONES[0]);
  const [proposedZone, setProposedZone] = useState(localZone);
  const [proposedHour, setProposedHour] = useState(10);
  const [grid, setGrid] = useState([]);
  const [hours, setHours] = useState(Array.from({ length: 24 }, (_, i) => i));
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/time-zone-meeting-planner', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { zones, proposedZone, proposedHour } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setAvailableZones(data.availableZones);
            setHours(data.hours);
            setGrid(data.grid);
            setZoneToAdd((prev) => (data.availableZones.includes(prev) ? prev : data.availableZones[0] || 'UTC'));
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [zones, proposedZone, proposedHour]);
  function handleAddZone() {
    if (zoneToAdd && !zones.includes(zoneToAdd)) {
      setZones((prev) => [...prev, zoneToAdd]);
    }
  }
  function handleRemoveZone(z) {
    setZones((prev) => prev.filter((x) => x !== z));
  }
  return (
    <div className="tool-page">
      <h1>Timezone Meeting Planner</h1>
      <p className="tool-description">
        Add multiple timezones and see a 24-hour grid marking each zone's typical 9-5 work hours, so
        overlapping meeting windows are easy to spot at a glance. Pick a proposed meeting time in one
        zone to see the equivalent local time - and whether it falls inside or outside work hours -
        in every other zone. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
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
      <div className="tool-controls">
        <label>
          Proposed meeting zone:
          <select value={proposedZone} onChange={(e) => setProposedZone(e.target.value)}>
            {availableZones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        <label>
          Proposed local hour:
          <select value={proposedHour} onChange={(e) => setProposedHour(Number(e.target.value))}>
            {hours.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </label>
      </div>
      {zones.length === 0 && <div className="tool-error">Add at least one timezone above.</div>}
      {zones.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="regex-groups-table" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                <th>Zone</th>
                {hours.map((h) => (
                  <th key={h} style={{ textAlign: 'center', padding: '4px 2px', fontWeight: 400 }}>
                    {h % 3 === 0 ? h : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((g) => (
                <tr key={g.zone}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <strong>{g.zone}</strong>
                    <button
                      className="uuid-copy-btn"
                      style={{ marginLeft: 8 }}
                      onClick={() => handleRemoveZone(g.zone)}
                      title="Remove this timezone"
                    >
                      Remove
                    </button>
                  </td>
                  {g.cells.map((cell) => (
                    <td
                      key={cell.utcHour}
                      title={`${String(cell.localHour).padStart(2, '0')}:00 local`}
                      style={{
                        padding: 0,
                        height: 22,
                        background: cell.work ? 'var(--accent-bg)' : 'transparent',
                        outline: cell.isProposed ? '2px solid var(--accent)' : 'none',
                        outlineOffset: -2
                      }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="tool-description" style={{ marginTop: 12, marginBottom: 0 }}>
        Shaded cells mark each zone's 9:00-17:00 work hours for today. The outlined column marks the
        proposed meeting hour.
      </div>
      {grid.length > 0 && (
        <ul className="uuid-list" style={{ marginTop: 16 }}>
          {grid.map((g) => (
            <li key={g.zone}>
              <span>
                <strong>{g.zone}</strong>
              </span>
              <code style={{ fontSize: 16 }}>
                {String(g.proposedLocalHour).padStart(2, '0')}:00 {g.proposedIsWork ? '(work hours)' : '(off hours)'}
              </code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
