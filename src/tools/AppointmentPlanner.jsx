import { useState } from 'react';
function daysUntil(dateStr) {
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
export default function AppointmentPlanner() {
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  function addAppointment() {
    if (!name.trim() || !date) return;
    setAppointments((prev) => [...prev, { id: Date.now(), name, date, time, reason }]);
    setName('');
    setDate('');
    setTime('');
    setReason('');
  }
  function removeAppointment(id) {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }
  const sorted = [...appointments].sort((a, b) => {
    const aKey = `${a.date}T${a.time || '00:00'}`;
    const bKey = `${b.date}T${b.time || '00:00'}`;
    return aKey.localeCompare(bKey);
  });
  return (
    <div className="tool-page">
      <h1>Appointment Planner</h1>
      <p className="tool-description">
        Track upcoming medical appointments - doctor or clinic name, date, time, and reason for
        visit - sorted chronologically with a days-until countdown. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not medical advice:</strong> This is a personal organizational tool only. It does
        not store data between visits (appointments are lost on page refresh) and does not provide
        any medical guidance. Always confirm appointment details directly with your provider.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="appt-name">Doctor / clinic name</label>
          <input id="appt-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Patel - Family Clinic" />
        </div>
        <div className="tool-panel">
          <label htmlFor="appt-date">Date</label>
          <input id="appt-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="appt-time">Time</label>
          <input id="appt-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="appt-reason">Reason for visit</label>
          <input id="appt-reason" type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Annual checkup" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={addAppointment} disabled={!name.trim() || !date}>
          Add appointment
        </button>
      </div>
      {sorted.length > 0 && (
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Doctor / clinic</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Countdown</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => {
                const days = daysUntil(a.date);
                let countdown;
                if (days < 0) countdown = `${Math.abs(days)} day(s) ago`;
                else if (days === 0) countdown = 'Today';
                else if (days === 1) countdown = 'Tomorrow';
                else countdown = `In ${days} days`;
                return (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.date}</td>
                    <td>{a.time || '-'}</td>
                    <td>{a.reason || '-'}</td>
                    <td><code>{countdown}</code></td>
                    <td>
                      <button type="button" className="uuid-copy-btn" onClick={() => removeAppointment(a.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
