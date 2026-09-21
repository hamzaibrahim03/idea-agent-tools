import { useState } from 'react';
function emptySubject() {
  return { name: '', weight: '1' };
}
function buildPlan(subjects, days) {
  const totalWeight = subjects.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
  if (totalWeight <= 0 || days <= 0) return [];
  const allocations = subjects.map((s) => {
    const weight = Number(s.weight) || 0;
    return { name: s.name, exact: (weight / totalWeight) * days };
  });
  let allocated = allocations.map((a) => ({ name: a.name, days: Math.floor(a.exact), remainder: a.exact - Math.floor(a.exact) }));
  let assignedTotal = allocated.reduce((sum, a) => sum + a.days, 0);
  let remaining = days - assignedTotal;
  const byRemainder = [...allocated].sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < remaining; i++) {
    byRemainder[i % byRemainder.length].days += 1;
  }
  const pool = [];
  allocated.forEach((a) => {
    for (let i = 0; i < a.days; i++) pool.push(a.name);
  });
  const schedule = Array.from({ length: days }, () => []);
  let dayIndex = 0;
  const bucket = {};
  allocated.forEach((a) => {
    bucket[a.name] = a.days;
  });
  const names = allocated.map((a) => a.name).filter((n) => bucket[n] > 0);
  let cursor = 0;
  let guard = 0;
  while (pool.length > 0 && guard < days * subjects.length * 4) {
    guard += 1;
    const name = names[cursor % names.length];
    cursor += 1;
    if (bucket[name] > 0) {
      schedule[dayIndex % days].push(name);
      bucket[name] -= 1;
      const idx = pool.indexOf(name);
      if (idx !== -1) pool.splice(idx, 1);
      dayIndex += 1;
    }
    if (names.every((n) => bucket[n] <= 0)) break;
  }
  return schedule;
}
export default function StudyPlanGenerator() {
  const [subjects, setSubjects] = useState([
    { name: 'Math', weight: '2' },
    { name: 'History', weight: '1' }
  ]);
  const [days, setDays] = useState('7');
  function updateSubject(i, field, value) {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }
  const validSubjects = subjects.filter((s) => s.name.trim());
  const daysNum = Math.max(0, Math.floor(Number(days) || 0));
  const plan = buildPlan(validSubjects, daysNum);
  return (
    <div className="tool-page">
      <h1>Study Plan Generator</h1>
      <p className="tool-description">
        Enter your subjects/topics, an optional priority weight for each, and the number of days
        until your exam. This tool distributes study time across the available days - proportional
        to each subject's weight - and outputs a day-by-day plan. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Days until exam:
          <input type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} style={{ width: '70px' }} />
        </label>
        <button type="button" onClick={() => setSubjects((prev) => [...prev, emptySubject()])}>
          Add subject
        </button>
      </div>
      <ul className="uuid-list">
        {subjects.map((s, i) => (
          <li key={i}>
            <input type="text" placeholder="Subject name" value={s.name} onChange={(e) => updateSubject(i, 'name', e.target.value)} style={{ flex: 1 }} />
            <label>
              Priority weight:
              <input
                type="number"
                min={1}
                value={s.weight}
                onChange={(e) => updateSubject(i, 'weight', e.target.value)}
                style={{ width: '60px', marginLeft: 4 }}
              />
            </label>
            <button
              type="button"
              className="uuid-copy-btn"
              onClick={() => setSubjects((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={subjects.length <= 1}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {plan.length === 0 ? (
        <p className="tool-placeholder">Add at least one subject and a number of days to generate a plan.</p>
      ) : (
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Subjects to study</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((subjectsForDay, i) => (
                <tr key={i}>
                  <td>Day {i + 1}</td>
                  <td>{subjectsForDay.length ? subjectsForDay.join(', ') : 'Rest / review'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
