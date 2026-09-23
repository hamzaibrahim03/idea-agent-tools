import { useEffect, useState } from 'react';
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
const DEFAULT_EQUIPMENT = [
  { name: 'CNC Mill #1', intervalDays: '30', lastServiced: todayIso() },
  { name: 'Forklift #2', intervalDays: '90', lastServiced: todayIso() }
];
export default function MaintenanceScheduleGenerator() {
  const [equipment, setEquipment] = useState(DEFAULT_EQUIPMENT);
  const [rows, setRows] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [fetchError, setFetchError] = useState('');
  function updateItem(index, field, value) {
    setEquipment((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }
  function addItem() {
    setEquipment((prev) => [...prev, { name: '', intervalDays: '', lastServiced: todayIso() }]);
  }
  function removeItem(index) {
    setEquipment((prev) => prev.filter((_, i) => i !== index));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/maintenance-schedule-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { equipment } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else {
            setRows(data.rows || []);
            setSorted(data.sorted || []);
          }
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [equipment]);
  return (
    <div className="tool-page">
      <h1>Maintenance Schedule Generator</h1>
      <p className="tool-description">
        Add equipment with a maintenance interval and last-serviced date, and get each item's next due
        date - sorted by urgency, soonest first.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
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
              const row = rows[i];
              const dueDate = row?.dueDate || null;
              const daysUntilDue = row?.daysUntilDue ?? null;
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
                  <td>{dueDate || '-'}</td>
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
      {sorted.length > 0 && sorted[0].validRow && (
        <div className="timestamp-result">
          <div>
            <strong>Most urgent:</strong> {sorted[0].name || '(unnamed)'} -{' '}
            {sorted[0].daysUntilDue < 0 ? `overdue by ${Math.abs(sorted[0].daysUntilDue)} day(s)` : `due in ${sorted[0].daysUntilDue} day(s)`}
          </div>
        </div>
      )}
    </div>
  );
}
