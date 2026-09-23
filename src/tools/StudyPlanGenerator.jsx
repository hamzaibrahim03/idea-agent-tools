import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
function emptySubject() {
  return { name: '', weight: '1' };
}
export default function StudyPlanGenerator() {
  const [subjects, setSubjects] = useState([
    { name: 'Math', weight: '2' },
    { name: 'History', weight: '1' }
  ]);
  const [days, setDays] = useState('7');
  const ai = useAiGenerate('study-plan', 'Study Plan Generator');
  const plan = ai.result;
  function updateSubject(i, field, value) {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }
  const validSubjects = subjects.filter((s) => s.name.trim());
  const daysNum = Math.max(0, Math.floor(Number(days) || 0));
  async function handleGenerate() {
    const subjectsSummary = validSubjects
      .map((s) => `${s.name} (priority weight ${s.weight || 1})`)
      .join(', ');
    await ai.generate({ subjects: subjectsSummary, daysUntilExam: daysNum });
  }
  return (
    <div className="tool-page">
      <h1>Study Plan Generator</h1>
      <p className="tool-description">
        Enter your subjects/topics, an optional priority weight for each, and the number of days
        until your exam, then click "Generate with AI" for a genuinely AI-generated day-by-day
        study schedule - free, no account needed (rate-limited to keep it free for everyone).
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
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || validSubjects.length === 0 || daysNum <= 0}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
          {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
        </button>
      </div>
      {ai.showApiSetup && (
        <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
      )}
      {ai.error && <div className="agent-error">{ai.error}</div>}
      {!plan && !ai.loading && (
        <p className="tool-placeholder">Add at least one subject and a number of days, then generate a plan.</p>
      )}
      {plan && (
        <>
          {plan.summary && <p style={{ opacity: 0.85 }}>{plan.summary}</p>}
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Subjects to study</th>
                </tr>
              </thead>
              <tbody>
                {(plan.schedule || []).map((day, i) => (
                  <tr key={i}>
                    <td>{day.day || `Day ${i + 1}`}</td>
                    <td>
                      {(day.subjects || []).length ? (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {day.subjects.map((subj, j) => (
                            <li key={j}>
                              <strong>{subj.subject}</strong>
                              {subj.minutes ? ` - ${subj.minutes} min` : ''}
                              {subj.focus ? ` (${subj.focus})` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'Rest / review'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
