import { useEffect, useState } from 'react';
const DEFAULT_PHASES = [
  { name: 'Site preparation', days: '5' },
  { name: 'Foundation', days: '10' },
  { name: 'Structure/framing', days: '20' },
  { name: 'Roofing', days: '7' },
  { name: 'Electrical & plumbing rough-in', days: '10' },
  { name: 'Finishing', days: '25' }
];
function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
export default function ProjectTimelineGenerator() {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [phases, setPhases] = useState(DEFAULT_PHASES);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState({ validStart: false, schedule: [], totalDays: 0, allValid: false, projectEndIso: null });
  const [error, setError] = useState('');
  function updatePhase(index, field, value) {
    setPhases((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }
  function addPhase() {
    setPhases((prev) => [...prev, { name: '', days: '' }]);
  }
  function removePhase(index) {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/project-timeline-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { startDate, phases } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setResult(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [startDate, phases]);
  const { validStart, schedule, totalDays, allValid, projectEndIso } = result;
  function buildPlainText() {
    const lines = [`Project timeline (start: ${startDate})`, ''];
    schedule.forEach((s, i) => {
      if (!s.validPhase) return;
      lines.push(`${i + 1}. ${s.name || '(unnamed phase)'} - ${s.days} day(s): ${formatDate(s.startIso)} to ${formatDate(s.endIso)}`);
    });
    if (projectEndIso) {
      lines.push('', `Total duration: ${totalDays} day(s), finishing ${formatDate(projectEndIso)}`);
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
      {error && <div className="agent-error">{error}</div>}
      {!error && !validStart && (
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
                    value={phases[i]?.name ?? s.name}
                    onChange={(e) => updatePhase(i, 'name', e.target.value)}
                    placeholder="e.g. Foundation"
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={phases[i]?.days ?? s.days}
                    onChange={(e) => updatePhase(i, 'days', e.target.value)}
                    style={{ width: '80px' }}
                  />
                </td>
                <td>{s.validPhase ? formatDate(s.startIso) : '—'}</td>
                <td>{s.validPhase ? formatDate(s.endIso) : '—'}</td>
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
      {!error && allValid && projectEndIso && (
        <div className="timestamp-result">
          <div>
            <strong>Total duration:</strong> {totalDays} day(s)
          </div>
          <div>
            <strong>Project finish date:</strong> {formatDate(projectEndIso)}
          </div>
        </div>
      )}
    </div>
  );
}
