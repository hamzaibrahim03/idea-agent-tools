import { useState } from 'react';
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
const DEFAULT_EQUIPMENT = [
  { name: 'CNC Mill #1', intervalDays: '30', lastServiced: todayIso() },
  { name: 'Forklift #2', intervalDays: '90', lastServiced: todayIso() }
];
function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d;
}
export default function MaintenanceScheduleGenerator() {
  const [equipment, setEquipment] = useState(DEFAULT_EQUIPMENT);
  function updateItem(index, field, value) {
    setEquipment((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }
  function addItem() {
    setEquipment((prev) => [...prev, { name: '', intervalDays: '', lastServiced: todayIso() }]);
  }
  function removeItem(index) {
    setEquipment((prev) => prev.filter((_, i) => i !== index));
  }
  const now = new Date();
  const rows = equipment
    .map((e) => {
      const interval = Number(e.intervalDays);
      const validRow = Number.isFinite(interval) && interval > 0 && !!e.lastServiced;
      if (!validRow) return { ...e, validRow, dueDate: null, daysUntilDue: null };
      const dueDate = addDays(e.lastServiced, interval);
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      return { ...e, validRow, dueDate, daysUntilDue };
    })
    .slice()
    .sort((a, b) => {
      if (a.daysUntilDue === null) return 1;
      if (b.daysUntilDue === null) return -1;
      return a.daysUntilDue - b.daysUntilDue;
    });
  return (
    <div className="tool-page">
      <h1>Maintenance Schedule Generator</h1>
      <p className="tool-description">
        Add equipment with a maintenance interval and last-serviced date, and get each item's next due
        date - sorted by urgency, soonest first. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={addItem}>
          Add equipment
        </button>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Interval (days)</th>
              <th>Last serviced</th>
              <th>Next due</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((e, i) => {
              const interval = Number(e.intervalDays);
              const validRow = Number.isFinite(interval) && interval > 0 && !!e.lastServiced;
              const dueDate = validRow ? addDays(e.lastServiced, interval) : null;
              const daysUntilDue = dueDate ? Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)) : null;
              return (
                <tr key={i}>
                  <td>
                    <input type="text" value={e.name} onChange={(ev) => updateItem(i, 'name', ev.target.value)} placeholder="e.g. CNC Mill #1" style={{ width: '100%' }} />
                  </td>
                  <td>
                    <input type="number" min={1} value={e.intervalDays} onChange={(ev) => updateItem(i, 'intervalDays', ev.target.value)} style={{ width: '80px' }} />
                  </td>
                  <td>
                    <input type="date" value={e.lastServiced} onChange={(ev) => updateItem(i, 'lastServiced', ev.target.value)} />
                  </td>
                  <td>{dueDate ? dueDate.toISOString().slice(0, 10) : '-'}</td>
                  <td>
                    {daysUntilDue === null ? (
                      '-'
                    ) : daysUntilDue < 0 ? (
                      <span className="tool-error-inline">Overdue by {Math.abs(daysUntilDue)}d</span>
                    ) : daysUntilDue <= 7 ? (
                      <span className="tool-error-inline">Due in {daysUntilDue}d</span>
                    ) : (
                      `Due in ${daysUntilDue}d`
                    )}
                  </td>
                  <td>
                    <button type="button" className="uuid-copy-btn" onClick={() => removeItem(i)} disabled={equipment.length <= 1}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length > 0 && rows[0].validRow && (
        <div className="timestamp-result">
          <div>
            <strong>Most urgent:</strong> {rows[0].name || '(unnamed)'} -{' '}
            {rows[0].daysUntilDue < 0 ? `overdue by ${Math.abs(rows[0].daysUntilDue)} day(s)` : `due in ${rows[0].daysUntilDue} day(s)`}
          </div>
        </div>
      )}
    </div>
  );
}
