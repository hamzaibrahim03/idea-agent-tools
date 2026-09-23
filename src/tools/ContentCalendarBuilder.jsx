import { useEffect, useState } from 'react';
export default function ContentCalendarBuilder() {
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('');
    const [date, setDate] = useState('');
    const [items, setItems] = useState([]);
    const [grouped, setGrouped] = useState([]);
    const [error, setError] = useState('');
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
    useEffect(() => {
        let cancelled = false;
        setError('');
        fetch('/api/tools/content-calendar-builder', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ input: { items } })
        })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                if (data.error) setError(data.error);
                else setGrouped(data.grouped || []);
            })
            .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        return () => { cancelled = true; };
    }, [items]);
    return (
        <div className="tool-page">
            <h1>Content Calendar Builder</h1>
            <p className="tool-description">
                Add content items with a title, platform, and planned date, and see them sorted
                chronologically and grouped by week.
            </p>
            {error && <div className="agent-error">{error}</div>}
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
