import { useEffect, useState } from 'react';
export default function CronParser() {
    const [input, setInput] = useState('*/15 9-17 * * 1-5');
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');
    const [description, setDescription] = useState('');
    const [upcoming, setUpcoming] = useState([]);
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/cron-parser', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setError('');
                        setDescription(data.description);
                        setUpcoming((data.upcoming || []).map((s) => new Date(s)));
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input]);
    return (
        <div className="tool-page">
            <h1>Cron Expression Parser</h1>
            <p className="tool-description">
                Paste a standard 5-field cron expression to see a plain-English description and the next
                upcoming run times, computed in your browser.
            </p>
            <div className="tool-panel">
                <label htmlFor="cron-input">Cron expression</label>
                <input id="cron-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="* * * * *" style={{ fontFamily: 'var(--mono)' }} />
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {error && <div className="tool-error">{error}</div>}
            {!error && (
                <div className="timestamp-result">
                    <span>
                        <strong>Meaning:</strong> {description}
                    </span>
                    <span>
                        <strong>Next runs:</strong>
                    </span>
                    <ul className="uuid-list">
                        {upcoming.map((d, i) => (
                            <li key={i}>
                                <code>{d.toLocaleString()}</code>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
