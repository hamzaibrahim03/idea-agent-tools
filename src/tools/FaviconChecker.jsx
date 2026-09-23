import { useEffect, useState } from 'react';
const CHECKLIST = [
    { size: '16x16', file: 'favicon.ico or favicon-16x16.png', note: 'Classic browser tab icon' },
    { size: '32x32', file: 'favicon-32x32.png', note: 'Higher-density browser tab / taskbar icon' },
    { size: '180x180', file: 'apple-touch-icon.png', note: 'iOS home screen icon' },
    { size: '192x192', file: 'icon-192.png', note: 'Android home screen / PWA manifest icon' },
    { size: '512x512', file: 'icon-512.png', note: 'PWA splash screen / manifest icon' },
];
export default function FaviconChecker() {
    const [paths, setPaths] = useState(['/favicon.ico']);
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [fetchError, setFetchError] = useState('');
    function updatePath(index, value) {
        setPaths((ps) => ps.map((p, i) => (i === index ? value : p)));
    }
    function addPath() {
        setPaths((ps) => [...ps, '']);
    }
    function removePath(index) {
        setPaths((ps) => ps.filter((_, i) => i !== index));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/favicon-checker', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { paths } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setFetchError(data.error);
                    else setOutput(data.output || '');
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [paths]);
    async function handleCopy() {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Favicon Tag Generator &amp; Checklist</h1>
            <p className="tool-description">
                Enter the favicon file paths you're using on your site and this tool generates the matching
                &lt;link&gt; tags to paste into your &lt;head&gt;, plus a checklist of the standard favicon
                sizes so you can self-verify you have everything you need. This does not fetch or check a
                live URL - it works entirely from the paths you type, in your browser.
            </p>
            <div className="tool-controls">
                <button onClick={addPath}>Add path</button>
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy tags'}
                </button>
            </div>
            {paths.map((path, i) => (
                <div className="tool-controls" key={i} style={{ marginBottom: '8px' }}>
                    <input type="text" value={path} onChange={(e) => updatePath(i, e.target.value)} placeholder="/favicon-32x32.png" style={{ flex: 1, minWidth: '160px' }} />
                    <button onClick={() => removePath(i)} disabled={paths.length <= 1}>
                        Remove
                    </button>
                </div>
            ))}
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="tool-panel">
                <label htmlFor="favicon-output">Generated tags</label>
                <textarea id="favicon-output" value={output} readOnly spellCheck={false} placeholder="Enter at least one favicon path above" />
            </div>
            <div className="tool-panel">
                <label>Recommended favicon sizes checklist</label>
                <div className="timestamp-result">
                    {CHECKLIST.map((item) => (
                        <div key={item.size}>
                            <code>{item.size}</code> - {item.file} <span style={{ opacity: 0.7 }}>({item.note})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
