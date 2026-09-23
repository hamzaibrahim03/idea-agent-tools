import { useEffect, useState } from 'react';
const CATEGORY_LABELS = {
    1: '1xx - Informational',
    2: '2xx - Success',
    3: '3xx - Redirection',
    4: '4xx - Client Error',
    5: '5xx - Server Error'
};
export default function HttpStatusCodeReference() {
    const [query, setQuery] = useState('');
    const [grouped, setGrouped] = useState([]);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/http-status-code-reference', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { query } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setFetchError(data.error);
                    else setGrouped(data.grouped || []);
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [query]);
    return (
        <div className="tool-page">
            <h1>HTTP Status Code Reference</h1>
            <p className="tool-description">
                A searchable reference table of common HTTP status codes, grouped by category (1xx-5xx),
                with a plain-language meaning for each. Runs entirely in your browser.
            </p>
            <div className="tool-panel">
                <label htmlFor="status-search">Search</label>
                <input id="status-search" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. 404, redirect, unauthorized" />
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {grouped.length === 0 && <p className="tool-placeholder">No matching status codes for "{query}".</p>}
            {grouped.map((g) => (
                <div key={g.cat} className="tool-panel">
                    <label>{CATEGORY_LABELS[g.cat]}</label>
                    <div className="regex-groups-wrap">
                        <table className="regex-groups-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Meaning</th>
                                </tr>
                            </thead>
                            <tbody>
                                {g.items.map((c) => (
                                    <tr key={c.code}>
                                        <td>
                                            <code>{c.code}</code>
                                        </td>
                                        <td>{c.name}</td>
                                        <td>{c.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}
