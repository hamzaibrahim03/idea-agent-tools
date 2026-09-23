import { useEffect, useState } from 'react';
export default function EmailSubjectLineTester() {
    const [subject, setSubject] = useState('');
    const [result, setResult] = useState({ length: 0, checks: [], score: 0, hasEmoji: false });
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        if (!subject.trim()) {
            return undefined;
        }
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/email-subject-line-tester', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { subject } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setFetchError(data.error);
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [subject]);
    return (
        <div className="tool-page">
            <h1>Email Subject Line Tester</h1>
            <p className="tool-description">
                Paste an email subject line to check it against common best-practice heuristics - length,
                ALL CAPS usage, spam-trigger words from a curated list, and personalization tokens. This is
                a heuristic checklist based on common guidance, not a real deliverability or spam-filter
                prediction. Runs entirely in your browser.
            </p>
            <div className="tool-panel">
                <label htmlFor="subject-input">Subject line</label>
                <input id="subject-input" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Your {name}, here's what's new this week" />
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {subject.trim() ? (
                <>
                    <div className="timestamp-result">
                        <span>
                            <strong>Heuristic score:</strong> {result.score}/100
                        </span>
                    </div>
                    <ul className="uuid-list">
                        {result.checks.map((c, i) => (
                            <li key={i}>
                                <span>{c.label}</span>
                                <span className={c.pass ? '' : 'tool-error-inline'}>{c.pass ? 'Pass' : 'Flagged'}</span>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p className="tool-placeholder">Enter a subject line to see the heuristic checklist.</p>
            )}
        </div>
    );
}
