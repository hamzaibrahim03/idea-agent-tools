import { useEffect, useState } from 'react';
export default function CitationGenerator() {
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [publisher, setPublisher] = useState('');
    const [url, setUrl] = useState('');
    const [copied, setCopied] = useState(null);
    const [data, setData] = useState({ apa: '', mla: '', chicago: '' });
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/citation-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { author, title, year, publisher, url } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) setError(d.error);
                    else setData(d);
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
            <h1>Citation Generator</h1>
            <p className="tool-description">
                Enter your source details to generate a citation formatted using the standard APA, MLA, and
                Chicago style rules. Double-check against your institution's style guide for edge cases
                (multiple authors, no author, etc.) not covered by this simplified form.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="cit-author">Author (Last, First)</label>
                    <input id="cit-author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Smith, Jane" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cit-title">Title</label>
                    <input id="cit-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Article Title" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cit-year">Year</label>
                    <input id="cit-year" type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cit-publisher">Publisher / Website</label>
                    <input id="cit-publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Example Press" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cit-url">URL (optional)</label>
                    <input id="cit-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/article" />
                </div>
            </div>
            {[
                { key: 'apa', label: 'APA', text: data.apa },
                { key: 'mla', label: 'MLA', text: data.mla },
                { key: 'chicago', label: 'Chicago', text: data.chicago }
            ].map(({ key, label, text }) => (
                <div key={key} className="tool-panel">
                    <label>{label}</label>
                    <div className="timestamp-result" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{text}</span>
                        <button type="button" className="uuid-copy-btn" onClick={() => copyText(text, key)}>
                            {copied === key ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
