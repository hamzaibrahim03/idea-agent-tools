import { useEffect, useRef, useState } from 'react';
export default function ItineraryBuilder() {
  const [entries, setEntries] = useState([]);
  const [day, setDay] = useState(1);
  const [time, setTime] = useState('09:00');
  const [description, setDescription] = useState('');
  const [grouped, setGrouped] = useState({});
  const [fetchError, setFetchError] = useState('');
  const nextId = useRef(1);
  function addEntry() {
    if (!description.trim()) return;
    setEntries((e) => [...e, { id: nextId.current++, day: parseInt(day, 10) || 1, time, description: description.trim() }]);
    setDescription('');
  }
  function removeEntry(id) {
    setEntries((e) => e.filter((entry) => entry.id !== id));
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setFetchError('');
      fetch('/api/tools/itinerary-builder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { entries } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setFetchError(data.error);
          else setGrouped(data.grouped || {});
        })
        .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [entries]);
  return (
    <div className="tool-page">
      <h1>Itinerary Builder</h1>
      <p className="tool-description">
        Add your own day-by-day itinerary entries - day number, time, and an activity or location
        you've chosen yourself - and get a clean day-by-day itinerary view sorted by day and time.
        This tool only organizes entries you type in; it does not suggest or look up locations.
      </p>
      {fetchError && <div className="agent-error">{fetchError}</div>}
      <div className="tool-controls">
        <label>
          Day:
          <input type="number" min="1" value={day} onChange={(e) => setDay(e.target.value)} style={{ width: '60px' }} />
        </label>
        <label>
          Time:
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Activity or location (e.g. Visit city museum)"
          style={{ flex: 1, minWidth: 200, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text-h)' }}
          onKeyDown={(e) => e.key === 'Enter' && addEntry()}
        />
        <button onClick={addEntry} disabled={!description.trim()}>Add entry</button>
      </div>
      {Object.keys(grouped).length === 0 && <p className="tool-placeholder">No itinerary entries yet - add your first one above.</p>}
      {Object.entries(grouped)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([dayNum, dayEntries]) => (
          <div key={dayNum} className="tool-panel">
            <label>Day {dayNum}</label>
            <div className="timestamp-result">
              {dayEntries.map((entry) => (
                <span key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <span>
                    <strong>{entry.time}</strong> - {entry.description}
                  </span>
                  <button className="uuid-copy-btn" onClick={() => removeEntry(entry.id)}>Remove</button>
                </span>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
