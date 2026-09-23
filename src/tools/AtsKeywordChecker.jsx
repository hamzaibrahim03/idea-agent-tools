import { useEffect, useState } from 'react';
export default function AtsKeywordChecker() {
    const [resume, setResume] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [topN, setTopN] = useState('25');
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/ats-keyword-checker', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { resume, jobDescription, topN } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setAnalysis(data.analysis);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 300);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [resume, jobDescription, topN]);
    return (
        <div className="tool-page">
            <h1>ATS Keyword Checker</h1>
            <p className="tool-description">
                Paste your resume text and a job description. This tool extracts the most frequent
                meaningful words from the job description and checks which ones are missing from your
                resume, using simple case-insensitive keyword overlap. This is a basic heuristic, not a
                real ATS (Applicant Tracking System) algorithm - actual ATS software uses proprietary
                parsing and scoring you can't fully replicate.
            </p>
            <div className="tool-controls">
                <label>
                    Keywords to check:
                    <input type="number" min={5} max={100} value={topN} onChange={(e) => setTopN(e.target.value)} style={{ width: '70px' }} />
                </label>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="ats-resume">Your resume text</label>
                    <textarea id="ats-resume" value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Paste your resume text here" style={{ minHeight: 220 }} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ats-jd">Job description</label>
                    <textarea id="ats-jd" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here" style={{ minHeight: 220 }} />
                </div>
            </div>
            {!analysis && <div className="tool-placeholder">Paste a job description to extract its top keywords.</div>}
            {analysis && (
                <>
                    <div className="timestamp-result">
                        <div>
                            <strong>Keyword match rate:</strong> {analysis.matchRate.toFixed(0)}% ({analysis.matched.length} of {analysis.topKeywords.length} top keywords found)
                        </div>
                    </div>
                    <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>Missing keywords ({analysis.missing.length})</h2>
                    {analysis.missing.length === 0 ? (
                        <p className="tool-placeholder">No missing keywords from the top list - nice overlap.</p>
                    ) : (
                        <div className="regex-groups-wrap">
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>Keyword</th>
                                        <th>Occurrences in job description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analysis.missing.map(([word, count]) => (
                                        <tr key={word}>
                                            <td>
                                                <code>{word}</code>
                                            </td>
                                            <td>{count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>Matched keywords ({analysis.matched.length})</h2>
                    {analysis.matched.length === 0 ? (
                        <p className="tool-placeholder">No overlap yet.</p>
                    ) : (
                        <p>{analysis.matched.map(([w]) => w).join(', ')}</p>
                    )}
                </>
            )}
        </div>
    );
}
