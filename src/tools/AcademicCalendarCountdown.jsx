import { useEffect, useState } from 'react';
function emptyEvent() {
    return { name: '', date: '' };
}
export default function AcademicCalendarCountdown() {
    const [events, setEvents] = useState([
        { name: 'Semester start', date: '' },
        { name: 'Midterms', date: '' },
        { name: 'Finals', date: '' }
    ]);
    const [withCountdown, setWithCountdown] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    function updateEvent(i, field, value) {
        setEvents((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setLoading(true);
            setError('');
            fetch('/api/tools/academic-calendar-countdown', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { events } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setWithCountdown(data.withCountdown || []);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); })
                .finally(() => { if (!cancelled) setLoading(false); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [events]);
    return (
        <div className="tool-page">
            <h1>Academic Calendar Countdown</h1>
            <p className="tool-description">
                Enter your key academic dates - semester start, midterms, finals, breaks - and see a
                countdown to each one, sorted chronologically from soonest to furthest away.
            </p>
            <div className="tool-controls">
                <button type="button" onClick={() => setEvents((prev) => [...prev, emptyEvent()])}>
                    Add date
                </button>
            </div>
            <ul className="uuid-list">
                {events.map((e, i) => (
                    <li key={i}>
                        <input type="text" placeholder="Event name" value={e.name} onChange={(ev) => updateEvent(i, 'name', ev.target.value)} style={{ flex: 1 }} />
                        <input type="date" value={e.date} onChange={(ev) => updateEvent(i, 'date', ev.target.value)} />
                        <button type="button" className="uuid-copy-btn" onClick={() => setEvents((prev) => prev.filter((_, idx) => idx !== i))} disabled={events.length <= 1} >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>Countdown</h2>
            {loading && <div className="agent-loading">Calculating...</div>}
            {error && <div className="agent-error">{error}</div>}
            {!loading && withCountdown.length === 0 ? (
                <p className="tool-placeholder">Add event names and dates above to see a sorted countdown.</p>
            ) : (
                <div className="regex-groups-wrap">
                    <table className="regex-groups-table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Date</th>
                                <th>Countdown</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withCountdown.map((e, i) => (
                                <tr key={i}>
                                    <td>{e.name}</td>
                                    <td>{e.date}</td>
                                    <td>
                                        {e.days > 0 && `${e.days} day${e.days === 1 ? '' : 's'} away`}
                                        {e.days === 0 && 'Today'}
                                        {e.days < 0 && `${Math.abs(e.days)} day${Math.abs(e.days) === 1 ? '' : 's'} ago`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
