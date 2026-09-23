import { useMemo, useState } from 'react';
function getWeekKey(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return 'Unscheduled';
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = target - firstThursday;
  const week = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
  return `${target.getFullYear()} - Week ${week}`;
}
export default function ContentCalendarBuilder() {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([]);
  function handleAdd() {
    if (!title.trim() || !date) return;
    setItems((prev) => [...prev, { id: Date.now(), title: title.trim(), platform: platform.trim() || 'General', date }]);
    setTitle('');
    setPlatform('');
    setDate('');
  }
  function handleRemove(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }
  const grouped = useMemo(() => {
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    const groups = new Map();
    sorted.forEach((item) => {
      const key = getWeekKey(item.date);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    return Array.from(groups.entries());
  }, [items]);
  return (
    <div className="tool-page">
      <h1>Content Calendar Builder</h1>
      <p className="tool-description">
        Add content items with a title, platform, and planned date, and see them sorted
        chronologically and grouped by week. Runs entirely in your browser - nothing is saved or
        synced anywhere.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="cal-title">Content title</label>
          <input id="cal-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Product launch teaser" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cal-platform">Platform</label>
          <input id="cal-platform" type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g. Instagram" />
        </div>
        <div className="tool-panel">
          <label htmlFor="cal-date">Planned date</label>
          <input id="cal-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="tool-controls">
        <button onClick={handleAdd} disabled={!title.trim() || !date}>
          Add item
        </button>
      </div>
      {grouped.length === 0 ? (
        <p className="tool-placeholder">No content items yet. Add one above.</p>
      ) : (
        grouped.map(([week, weekItems]) => (
          <div key={week} className="tool-panel">
            <label>{week}</label>
            <ul className="uuid-list">
              {weekItems.map((item) => (
                <li key={item.id}>
                  <span>
                    <strong>{item.date}</strong> - {item.title} ({item.platform})
                  </span>
                  <button className="uuid-copy-btn" onClick={() => handleRemove(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
