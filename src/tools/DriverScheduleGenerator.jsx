import { useState } from 'react';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_SHIFTS = [
  { driver: 'Alex', day: 'Monday', start: '08:00', end: '16:00' },
  { driver: 'Alex', day: 'Tuesday', start: '08:00', end: '16:00' },
  { driver: 'Jordan', day: 'Monday', start: '15:00', end: '23:00' }
];
function toMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
export default function DriverScheduleGenerator() {
  const [shifts, setShifts] = useState(DEFAULT_SHIFTS);
  function updateShift(index, field, value) {
    setShifts((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }
  function addShift() {
    setShifts((prev) => [...prev, { driver: '', day: 'Monday', start: '08:00', end: '16:00' }]);
  }
  function removeShift(index) {
    setShifts((prev) => prev.filter((_, i) => i !== index));
  }
  const overlapIndices = new Set();
  for (let i = 0; i < shifts.length; i++) {
    for (let j = i + 1; j < shifts.length; j++) {
      const a = shifts[i];
      const b = shifts[j];
      if (a.driver.trim() && a.driver === b.driver && a.day === b.day) {
        const aStart = toMinutes(a.start);
        const aEnd = toMinutes(a.end);
        const bStart = toMinutes(b.start);
        const bEnd = toMinutes(b.end);
        if (aStart < bEnd && bStart < aEnd) {
          overlapIndices.add(i);
          overlapIndices.add(j);
        }
      }
    }
  }
  return (
    <div className="tool-page">
      <h1>Driver Schedule Generator</h1>
      <p className="tool-description">
        Add driver shifts (driver name, day, start and end time) to build a weekly schedule table.
        Overlapping shifts for the same driver on the same day are flagged automatically. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addShift}>
          Add shift
        </button>
      </div>
      {overlapIndices.size > 0 && (
        <div className="tool-error">
          <strong>Warning:</strong> {overlapIndices.size} shift(s) below overlap with another shift for the same driver on the same day.
        </div>
      )}
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s, i) => (
              <tr key={i} style={overlapIndices.has(i) ? { background: 'rgba(220,38,38,0.08)' } : undefined}>
                <td>
                  <input type="text" value={s.driver} onChange={(e) => updateShift(i, 'driver', e.target.value)} placeholder="e.g. Alex" style={{ width: '100%' }} />
                </td>
                <td>
                  <select value={s.day} onChange={(e) => updateShift(i, 'day', e.target.value)}>
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input type="time" value={s.start} onChange={(e) => updateShift(i, 'start', e.target.value)} />
                </td>
                <td>
                  <input type="time" value={s.end} onChange={(e) => updateShift(i, 'end', e.target.value)} />
                </td>
                <td>{overlapIndices.has(i) && <span className="tool-error-inline">Overlap</span>}</td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeShift(i)} disabled={shifts.length <= 1}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tool-panel">
        <label>Weekly view by day</label>
        {DAYS.map((day) => {
          const dayShifts = shifts.filter((s) => s.day === day);
          if (dayShifts.length === 0) return null;
          return (
            <div key={day} style={{ marginBottom: 8 }}>
              <strong>{day}:</strong>{' '}
              {dayShifts.map((s) => `${s.driver || '(unnamed)'} ${s.start}-${s.end}`).join(', ')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
