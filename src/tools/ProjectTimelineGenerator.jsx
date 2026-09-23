import { useState } from 'react';
const DEFAULT_PHASES = [
  { name: 'Site preparation', days: '5' },
  { name: 'Foundation', days: '10' },
  { name: 'Structure/framing', days: '20' },
  { name: 'Roofing', days: '7' },
  { name: 'Electrical & plumbing rough-in', days: '10' },
  { name: 'Finishing', days: '25' }
];
function addDays(date, days) {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}
function formatDate(date) {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
export default function ProjectTimelineGenerator() {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [phases, setPhases] = useState(DEFAULT_PHASES);
  const [copied, setCopied] = useState(false);
  function updatePhase(index, field, value) {
    setPhases((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }
  function addPhase() {
    setPhases((prev) => [...prev, { name: '', days: '' }]);
  }
  function removePhase(index) {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  }
  const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const validStart = start instanceof Date && !Number.isNaN(start.getTime());
  const { schedule, totalDays } = phases.reduce(
    (acc, p) => {
      const durationNum = Number(p.days);
      const validPhase = validStart && Number.isFinite(durationNum) && durationNum > 0;
      if (!validPhase) {
        acc.schedule.push({ ...p, validPhase: false });
        return acc;
      }
      const phaseStart = acc.cursor;
      const phaseEnd = addDays(acc.cursor, durationNum - 1);
      acc.schedule.push({ ...p, validPhase: true, start: phaseStart, end: phaseEnd });
      acc.cursor = addDays(acc.cursor, durationNum);
      acc.totalDays += durationNum;
      return acc;
    },
    { schedule: [], totalDays: 0, cursor: start }
  );
  const allValid = validStart && schedule.every((s) => s.validPhase);
  const projectEnd = allValid && schedule.length > 0 ? schedule[schedule.length - 1].end : null;
  function buildPlainText() {
    const lines = [`Project timeline (start: ${startDate})`, ''];
    schedule.forEach((s, i) => {
      if (!s.validPhase) return;
      lines.push(`${i + 1}. ${s.name || '(unnamed phase)'} - ${s.days} day(s): ${formatDate(s.start)} to ${formatDate(s.end)}`);
    });
    if (projectEnd) {
      lines.push('', `Total duration: ${totalDays} day(s), finishing ${formatDate(projectEnd)}`);
    }
    return lines.join('\n');
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Construction Project Timeline Generator</h1>
      <p className="tool-description">
        Enter a project start date and a sequence of phases with their duration in days - the tool
        chains them sequentially and shows each phase's start/end date as a simple text-based
        timeline. This does not account for overlapping phases, weekends, or holidays; adjust
        durations to compensate if needed. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Start date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <button type="button" onClick={addPhase}>
          Add phase
        </button>
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy timeline'}
        </button>
      </div>
      {!validStart && (
        <div className="tool-error">
          <strong>Error:</strong> Enter a valid start date.
        </div>
      )}
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Phase</th>
              <th>Duration (days)</th>
              <th>Start</th>
              <th>End</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((s, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => updatePhase(i, 'name', e.target.value)}
                    placeholder="e.g. Foundation"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={s.days}
                    onChange={(e) => updatePhase(i, 'days', e.target.value)}
                    style={{ width: '80px' }}
                  />
                </td>
                <td>{s.validPhase ? formatDate(s.start) : '—'}</td>
                <td>{s.validPhase ? formatDate(s.end) : '—'}</td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removePhase(i)} disabled={phases.length <= 1}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {allValid && projectEnd && (
        <div className="timestamp-result">
          <div>
            <strong>Total duration:</strong> {totalDays} day(s)
          </div>
          <div>
            <strong>Project finish date:</strong> {formatDate(projectEnd)}
          </div>
        </div>
      )}
    </div>
  );
}
