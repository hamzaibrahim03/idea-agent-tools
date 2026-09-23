import { useState } from 'react';
function addMinutes(timeStr, minutes) {
  const [h, m] = timeStr.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  const total = h * 60 + m + minutes;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
export default function MeetingAgendaGenerator() {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [items, setItems] = useState([
    { topic: 'Welcome & objectives', minutes: '5' },
    { topic: 'Project updates', minutes: '15' },
    { topic: 'Open discussion', minutes: '10' }
  ]);
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
  const scheduled = items.reduce((acc, it) => {
    const mins = Number(it.minutes) || 0;
    const cursor = acc.length ? acc[acc.length - 1].nextStart : startTime;
    const nextStart = addMinutes(cursor, mins) || cursor;
    acc.push({ ...it, mins, start: cursor, nextStart });
    return acc;
  }, []);
  const totalMinutes = items.reduce((sum, it) => sum + (Number(it.minutes) || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return (
    <div className="tool-page">
      <h1>Meeting Agenda Generator</h1>
      <p className="tool-description">
        Add agenda items with allocated time to compute the total meeting duration and render a
        clean, printable agenda with a calculated start time per item based on your chosen meeting
        start time. Runs entirely in your browser.
      </p>
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
            {scheduled.map((it, i) => (
              <tr key={i}>
                <td>
                  <code>{it.start || '—'}</code>
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
          <strong>Estimated end time:</strong> <code>{addMinutes(startTime, totalMinutes) || '—'}</code>
        </div>
      </div>
    </div>
  );
}
