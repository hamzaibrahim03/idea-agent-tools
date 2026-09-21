import { useState } from 'react';
const GRADE_POINTS = {
  'A+': 4.0, A: 4.0, 'A-': 3.7,
  'B+': 3.3, B: 3.0, 'B-': 2.7,
  'C+': 2.3, C: 2.0, 'C-': 1.7,
  'D+': 1.3, D: 1.0, F: 0.0
};
function computeGpa(courses) {
  let totalPoints = 0;
  let totalCredits = 0;
  for (const c of courses) {
    const credits = Number(c.credits);
    const points = GRADE_POINTS[c.grade];
    if (!Number.isFinite(credits) || credits <= 0 || points === undefined) continue;
    totalPoints += credits * points;
    totalCredits += credits;
  }
  return totalCredits > 0 ? totalPoints / totalCredits : null;
}
export default function GpaCalculator() {
  const [courses, setCourses] = useState([
    { name: 'Course 1', credits: '3', grade: 'A' },
    { name: 'Course 2', credits: '3', grade: 'B+' }
  ]);
  function updateCourse(index, field, value) {
    setCourses((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }
  function addCourse() {
    setCourses((prev) => [...prev, { name: `Course ${prev.length + 1}`, credits: '3', grade: 'A' }]);
  }
  function removeCourse(index) {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  }
  const gpa = computeGpa(courses);
  const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  return (
    <div className="tool-page">
      <h1>GPA Calculator</h1>
      <p className="tool-description">
        Calculate your GPA on the standard US 4.0 scale from your courses' credit hours and
        letter grades. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addCourse}>
          Add course
        </button>
      </div>
      <ul className="uuid-list">
        {courses.map((c, i) => (
          <li key={i}>
            <input
              type="text"
              value={c.name}
              onChange={(e) => updateCourse(i, 'name', e.target.value)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <label style={{ marginRight: 8 }}>
              Credits:
              <input
                type="number"
                min={0}
                step="0.5"
                value={c.credits}
                onChange={(e) => updateCourse(i, 'credits', e.target.value)}
                style={{ width: '60px', marginLeft: 4 }}
              />
            </label>
            <select value={c.grade} onChange={(e) => updateCourse(i, 'grade', e.target.value)} style={{ marginRight: 8 }}>
              {Object.keys(GRADE_POINTS).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <button type="button" className="uuid-copy-btn" onClick={() => removeCourse(i)} disabled={courses.length <= 1}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="timestamp-result">
        <div>
          <strong>Total credits:</strong> {totalCredits}
        </div>
        <div>
          <strong>GPA:</strong> {gpa !== null ? gpa.toFixed(2) : '—'}
        </div>
      </div>
    </div>
  );
}
