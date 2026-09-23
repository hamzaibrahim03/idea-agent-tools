import { useEffect, useState } from 'react';
export default function MeetingAgendaGenerator() {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [items, setItems] = useState([
    { topic: 'Welcome & objectives', minutes: '5' },
    { topic: 'Project updates', minutes: '15' },
    { topic: 'Open discussion', minutes: '10' }
  ]);
  const [scheduled, setScheduled] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [endTime, setEndTime] = useState('');
  const [fetchError, setFetchError] = useState('');
  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { topic: '', minutes: '5' }]);
  }
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  function handlePrint() {
    window.print();
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/meeting-agenda-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { startTime, items } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else {
            setScheduled(data.scheduled || []);
            setTotalMinutes(data.totalMinutes || 0);
            setHours(data.hours || 0);
            setMins(data.mins || 0);
            setEndTime(data.endTime || '');
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [startTime, items]);
  return (
    <div className="tool-page">
      <h1>Meeting Agenda Generator</h1>
      <p className="tool-description">
        Add agenda items with allocated time to compute the total meeting duration and render a
        clean, printable agenda with a calculated start time per item based on your chosen meeting
        start time.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Meeting title:
          <input type="text" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} style={{ minWidth: '200px' }} />
        </label>
        <label>
          Start time:
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>
        <button type="button" onClick={addItem}>
          Add agenda item
        </button>
        <button type="button" onClick={handlePrint}>
          Print agenda
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Start</th>
              <th>Topic</th>
              <th>Minutes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>
                  <code>{scheduled[i]?.start || '—'}</code>
                </td>
                <td>
                  <input type="text" value={it.topic} onChange={(e) => updateItem(i, 'topic', e.target.value)} style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" min={0} value={it.minutes} onChange={(e) => updateItem(i, 'minutes', e.target.value)} style={{ width: '70px' }} />
                </td>
                <td>
                  <button type="button" className="uuid-copy-btn" onClick={() => removeItem(i)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Total meeting duration:</strong> <code>{hours}h {mins}m</code> ({totalMinutes} minutes)
        </div>
        <div>
          <strong>Estimated end time:</strong> <code>{endTime || '—'}</code>
        </div>
      </div>
    </div>
  );
}
