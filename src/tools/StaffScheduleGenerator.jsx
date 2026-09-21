import { useState } from 'react';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function toMinutes(time) {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
function shiftsOverlap(a, b) {
  const aStart = toMinutes(a.start);
  const aEnd = toMinutes(a.end);
  const bStart = toMinutes(b.start);
  const bEnd = toMinutes(b.end);
  if (aStart === null || aEnd === null || bStart === null || bEnd === null) return false;
  return aStart < bEnd && bStart < aEnd;
}
export default function StaffScheduleGenerator() {
  const [shifts, setShifts] = useState([
    { id: 1, name: 'Alex', day: 'Monday', start: '09:00', end: '17:00', role: 'Server' },
    { id: 2, name: 'Alex', day: 'Monday', start: '16:00', end: '22:00', role: 'Bartender' },
    { id: 3, name: 'Jamie', day: 'Tuesday', start: '10:00', end: '18:00', role: 'Cook' }
  ]);
  const [name, setName] = useState('');
  const [day, setDay] = useState('Monday');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [role, setRole] = useState('');
  function addShift() {
    if (!name.trim() || !start || !end) return;
    setShifts((prev) => [...prev, { id: Date.now(), name, day, start, end, role }]);
    setName('');
    setStart('');
    setEnd('');
    setRole('');
  }
  function removeShift(id) {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  }
  const overlappingIds = new Set();
  for (let i = 0; i < shifts.length; i++) {
    for (let j = i + 1; j < shifts.length; j++) {
      if (shifts[i].name.trim().toLowerCase() !== shifts[j].name.trim().toLowerCase()) continue;
      if (shifts[i].day !== shifts[j].day) continue;
      if (shiftsOverlap(shifts[i], shifts[j])) {
        overlappingIds.add(shifts[i].id);
        overlappingIds.add(shifts[j].id);
      }
    }
  }
  return (
    <div className="tool-page">
      <h1>Restaurant Staff Schedule Generator</h1>
      <p className="tool-description">
        Add staff shifts - name, day, start time, end time, and role - to build a weekly schedule
        table. Overlapping shifts for the same staff member on the same day are automatically
        flagged. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ss-name">Staff name</label>
          <input id="ss-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jordan" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ss-day">Day</label>
          <select id="ss-day" value={day} onChange={(e) => setDay(e.target.value)}>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="tool-panel">
          <label htmlFor="ss-start">Start time</label>
          <input id="ss-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ss-end">End time</label>
          <input id="ss-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ss-role">Role</label>
          <input id="ss-role" type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Server" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addShift} disabled={!name.trim() || !start || !end}>
          Add shift
        </button>
      </div>
      {overlappingIds.size > 0 && (
        <div className="tool-error">
          <strong>Overlap warning:</strong> Some staff members have overlapping shifts on the same
          day - see rows marked below.
        </div>
      )}
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Staff</th>
              <th>Start</th>
              <th>End</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {DAYS.flatMap((d) =>
              shifts
                .filter((s) => s.day === d)
                .sort((a, b) => (a.start || '').localeCompare(b.start || ''))
                .map((s) => (
                  <tr key={s.id} style={overlappingIds.has(s.id) ? { background: 'rgba(255,0,0,0.08)' } : undefined}>
                    <td>{s.day}</td>
                    <td>{s.name}{overlappingIds.has(s.id) ? ' ⚠' : ''}</td>
                    <td>{s.start}</td>
                    <td>{s.end}</td>
                    <td>{s.role || '-'}</td>
                    <td>
                      <button type="button" className="uuid-copy-btn" onClick={() => removeShift(s.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
