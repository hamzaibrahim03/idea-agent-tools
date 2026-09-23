import { useState } from 'react';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function emptyClass() {
  return { name: '', day: 'Monday', start: '09:00', end: '10:00' };
}
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function findConflicts(classes) {
  const conflicts = new Set();
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const a = classes[i];
      const b = classes[j];
      if (a.day !== b.day) continue;
      const aStart = toMinutes(a.start);
      const aEnd = toMinutes(a.end);
      const bStart = toMinutes(b.start);
      const bEnd = toMinutes(b.end);
      if (aStart < bEnd && bStart < aEnd) {
        conflicts.add(i);
        conflicts.add(j);
      }
    }
  }
  return conflicts;
}
export default function ClassScheduleBuilder() {
  const [classes, setClasses] = useState([
    { name: 'Calculus', day: 'Monday', start: '09:00', end: '10:00' },
    { name: 'Chemistry', day: 'Wednesday', start: '11:00', end: '12:30' }
  ]);
  function updateClass(i, field, value) {
    setClasses((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }
  const conflicts = findConflicts(classes);
  return (
    <div className="tool-page">
      <h1>Class Schedule Builder</h1>
      <p className="tool-description">
        Add your classes with day and start/end time to see a weekly grid view, with any
        overlapping time conflicts on the same day flagged automatically. Runs entirely in your
        browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={() => setClasses((prev) => [...prev, emptyClass()])}>
          Add class
        </button>
      </div>
      <ul className="uuid-list">
        {classes.map((c, i) => (
          <li key={i} style={{ background: conflicts.has(i) ? 'rgba(220, 38, 38, 0.1)' : undefined }}>
            <input
              type="text"
              placeholder="Class name"
              value={c.name}
              onChange={(e) => updateClass(i, 'name', e.target.value)}
              style={{ flex: 1 }}
            />
            <select value={c.day} onChange={(e) => updateClass(i, 'day', e.target.value)}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input type="time" value={c.start} onChange={(e) => updateClass(i, 'start', e.target.value)} />
            <span>to</span>
            <input type="time" value={c.end} onChange={(e) => updateClass(i, 'end', e.target.value)} />
            {conflicts.has(i) && <span className="tool-error-inline">Conflict</span>}
            <button
              type="button"
              className="uuid-copy-btn"
              onClick={() => setClasses((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={classes.length <= 1}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {conflicts.size > 0 && (
        <div className="tool-error">
          <strong>Schedule conflict:</strong> {conflicts.size} class(es) have overlapping times on the same day - highlighted above.
        </div>
      )}
      <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>Weekly grid</h2>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Classes</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => {
              const dayClasses = classes
                .map((c, i) => ({ ...c, idx: i }))
                .filter((c) => c.day === day)
                .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
              return (
                <tr key={day}>
                  <td>{day}</td>
                  <td>
                    {dayClasses.length === 0
                      ? '—'
                      : dayClasses
                        .map((c) => `${c.name || '(untitled)'} (${c.start}-${c.end})${conflicts.has(c.idx) ? ' [conflict]' : ''}`)
                        .join(', ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
