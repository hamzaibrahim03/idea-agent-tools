import { useEffect, useState } from 'react';
export default function GitCommandReference() {
    const [query, setQuery] = useState('');
    const [grouped, setGrouped] = useState({});
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/git-command-reference', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { query } })
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
    }, [query]);
    return (
        <div className="tool-page">
            <h1>Git Command Reference</h1>
            <p className="tool-description">
                A searchable reference table of common git commands grouped by category - branching,
                committing, remote operations, and undoing changes - with syntax and a one-line explanation
                for each. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search commands (e.g. stash, merge, undo)" style={{ flex: 1, minWidth: 220, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text-h)' }} />
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {Object.keys(grouped).length === 0 && <p className="tool-placeholder">No commands match your search.</p>}
            {Object.entries(grouped).map(([category, cmds]) => (
                <div key={category} className="tool-panel">
                    <label>{category}</label>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="regex-groups-table">
                            <tbody>
                                {cmds.map((c) => (
                                    <tr key={c.cmd}>
                                        <td><code>{c.cmd}</code></td>
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
