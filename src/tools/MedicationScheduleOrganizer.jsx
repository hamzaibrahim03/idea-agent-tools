import { useEffect, useState } from 'react';
export default function MedicationScheduleOrganizer() {
  const [medications, setMedications] = useState([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesPerDay, setTimesPerDay] = useState('1');
  const [timesInput, setTimesInput] = useState('08:00');
  const [byTime, setByTime] = useState({});
  const [sortedTimeKeys, setSortedTimeKeys] = useState([]);
  const [fetchError, setFetchError] = useState('');
  function addMedication() {
    if (!name.trim() || !timesInput) return;
    const times = timesInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setMedications((prev) => [...prev, { id: Date.now(), name, dosage, timesPerDay, times }]);
    setName('');
    setDosage('');
    setTimesPerDay('1');
    setTimesInput('');
  }
  function removeMedication(id) {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/medication-schedule-organizer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { medications } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else {
            setByTime(data.byTime || {});
            setSortedTimeKeys(data.sortedTimeKeys || []);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [medications]);
  return (
    <div className="tool-page">
      <h1>Medication Schedule Organizer</h1>
      <p className="tool-description">
        Add your medications with dosage and the specific times you take them, and see a simple
        daily schedule of what to take when.
      </p>
      <div className="tool-error">
        <strong>Not medical advice:</strong> This is an organizational aid only, built from what
        you enter. It does not check for interactions, verify dosages, or replace your doctor's or
        pharmacist's instructions. Always follow the actual guidance on your prescription label.
      </div>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="med-name">Medication name</label>
          <input id="med-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Metformin" />
        </div>
        <div className="tool-panel">
          <label htmlFor="med-dosage">Dosage</label>
          <input id="med-dosage" type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 500 mg" />
        </div>
        <div className="tool-panel">
          <label htmlFor="med-times-per-day">Times per day</label>
          <input id="med-times-per-day" type="number" min={1} value={timesPerDay} onChange={(e) => setTimesPerDay(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="med-times">Specific times (comma-separated, e.g. 08:00, 20:00)</label>
          <input id="med-times" type="text" value={timesInput} onChange={(e) => setTimesInput(e.target.value)} placeholder="08:00, 20:00" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addMedication} disabled={!name.trim() || !timesInput.trim()}>
          Add medication
        </button>
      </div>
      {medications.length > 0 && (
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Times/day</th>
                <th>Scheduled times</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {medications.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.dosage || '-'}</td>
                  <td>{m.timesPerDay}</td>
                  <td>{m.times.join(', ')}</td>
                  <td>
                    <button type="button" className="uuid-copy-btn" onClick={() => removeMedication(m.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {sortedTimeKeys.length > 0 && (
        <>
          <h2>Daily schedule</h2>
          <div className="timestamp-result">
            {sortedTimeKeys.map((t) => (
              <div key={t}>
                <strong>{t}:</strong> {byTime[t].map((m) => `${m.name}${m.dosage ? ` (${m.dosage})` : ''}`).join(', ')}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
