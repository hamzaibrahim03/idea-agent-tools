import { useState } from 'react';
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
function hourInZone(referenceDateUtc, utcHour, timeZone) {
  const probe = new Date(
    Date.UTC(
      referenceDateUtc.getUTCFullYear(),
      referenceDateUtc.getUTCMonth(),
      referenceDateUtc.getUTCDate(),
      utcHour
    )
  );
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', hour12: false });
  const parts = dtf.formatToParts(probe);
  const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '00';
  return Number(hourPart) % 24;
}
function isWorkHour(hour) {
  return hour >= 9 && hour < 17;
}
export default function TimeZoneMeetingPlanner() {
  const availableZones = getAvailableZones();
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const [zones, setZones] = useState(() => {
    const defaults = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
    return defaults.includes(localZone) ? defaults : [localZone, ...defaults];
  });
  const [zoneToAdd, setZoneToAdd] = useState(availableZones[0] || 'UTC');
  const [proposedZone, setProposedZone] = useState(localZone);
  const [proposedHour, setProposedHour] = useState(10);
  const referenceDate = new Date();
  function handleAddZone() {
    if (zoneToAdd && !zones.includes(zoneToAdd)) {
      setZones((prev) => [...prev, zoneToAdd]);
    }
  }
  function handleRemoveZone(z) {
    setZones((prev) => prev.filter((x) => x !== z));
  }
  function findUtcHourForLocal(zone, localHour) {
    for (let utcHour = 0; utcHour < 24; utcHour++) {
      if (hourInZone(referenceDate, utcHour, zone) === localHour) return utcHour;
    }
    return localHour;
  }
  const proposedUtcHour = findUtcHourForLocal(proposedZone, Number(proposedHour));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="tool-page">
      <h1>Timezone Meeting Planner</h1>
      <p className="tool-description">
        Add multiple timezones and see a 24-hour grid marking each zone's typical 9-5 work hours, so
        overlapping meeting windows are easy to spot at a glance. Pick a proposed meeting time in one
        zone to see the equivalent local time - and whether it falls inside or outside work hours -
        in every other zone. Runs entirely in your browser.
      </p>
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
              {zones.map((z) => {
                return (
                  <tr key={z}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <strong>{z}</strong>
                      <button
                        className="uuid-copy-btn"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleRemoveZone(z)}
                        title="Remove this timezone"
                      >
                        Remove
                      </button>
                    </td>
                    {hours.map((utcHour) => {
                      const localHour = hourInZone(referenceDate, utcHour, z);
                      const work = isWorkHour(localHour);
                      const isProposed = utcHour === proposedUtcHour;
                      return (
                        <td
                          key={utcHour}
                          title={`${String(localHour).padStart(2, '0')}:00 local`}
                          style={{
                            padding: 0,
                            height: 22,
                            background: work ? 'var(--accent-bg)' : 'transparent',
                            outline: isProposed ? '2px solid var(--accent)' : 'none',
                            outlineOffset: -2
                          }}
                        />
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="tool-description" style={{ marginTop: 12, marginBottom: 0 }}>
        Shaded cells mark each zone's 9:00-17:00 work hours for today. The outlined column marks the
        proposed meeting hour.
      </div>
      {zones.length > 0 && (
        <ul className="uuid-list" style={{ marginTop: 16 }}>
          {zones.map((z) => {
            const proposedLocalHour = hourInZone(referenceDate, proposedUtcHour, z);
            const proposedIsWork = isWorkHour(proposedLocalHour);
            return (
              <li key={z}>
                <span>
                  <strong>{z}</strong>
                </span>
                <code style={{ fontSize: 16 }}>
                  {String(proposedLocalHour).padStart(2, '0')}:00 {proposedIsWork ? '(work hours)' : '(off hours)'}
                </code>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
