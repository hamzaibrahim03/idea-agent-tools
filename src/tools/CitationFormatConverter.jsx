import { useEffect, useState } from 'react';
const LABELS = { apa: 'APA', mla: 'MLA', chicago: 'Chicago' };
export default function CitationFormatConverter() {
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [publisher, setPublisher] = useState('');
    const [url, setUrl] = useState('');
    const [copied, setCopied] = useState(null);
    const [results, setResults] = useState({ apa: '', mla: '', chicago: '' });
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/citation-format-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { author, title, year, publisher, url } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setResults(data.results || {});
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [author, title, year, publisher, url]);
    async function copyText(text, key) {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(key);
            setTimeout(() => setCopied(null), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Citation Format Converter</h1>
            <p className="tool-description">
                Enter a source's structured fields once (author, title, year, publisher, URL) and see it
                instantly reformatted across APA, MLA, and Chicago styles side by side, using the same
                standard formatting rules as a citation generator. Useful for converting a citation you
                already have from one style to another.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="cfc-author">Author (Last, First)</label>
                    <input id="cfc-author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Smith, Jane" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cfc-title">Title</label>
                    <input id="cfc-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Article Title" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cfc-year">Year</label>
                    <input id="cfc-year" type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cfc-publisher">Publisher / Website</label>
                    <input id="cfc-publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Example Press" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cfc-url">URL (optional)</label>
                    <input id="cfc-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/article" />
                </div>
            </div>
            {Object.keys(LABELS).map((key) => (
                <div key={key} className="tool-panel">
                    <label>{LABELS[key]}</label>
                    <div className="timestamp-result" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{results[key]}</span>
                        <button type="button" className="uuid-copy-btn" onClick={() => copyText(results[key], key)}>
                            {copied === key ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
