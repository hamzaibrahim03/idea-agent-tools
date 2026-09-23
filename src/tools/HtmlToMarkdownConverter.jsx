import { useEffect, useState } from 'react';
export default function HtmlToMarkdownConverter() {
    const [input, setInput] = useState(
        '<h1>Title</h1>\n<p>Some <strong>bold</strong> and <em>italic</em> text with a <a href="https://example.com">link</a>.</p>\n<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>'
    );
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/html-to-markdown-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input } })
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
    }, [input]);
    async function handleCopy() {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Non-critical convenience action - fail silently on clipboard denial.
        }
    }
    return (
        <div className="tool-page">
            <h1>HTML to Markdown Converter</h1>
            <p className="tool-description">
                Paste basic HTML and convert it to Markdown - headings, bold/italic, links, lists,
                blockquotes, and paragraphs. Handles common HTML, not the full spec. Runs entirely in
                your browser.
            </p>
            <div className="tool-controls">
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy Markdown'}
                </button>
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="html-input">HTML</label>
                    <textarea id="html-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="<h1>Hello</h1>" spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="md-output">Markdown</label>
                    <textarea id="md-output" value={output} readOnly spellCheck={false} placeholder="Result will appear here" />
                </div>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
        </div>
    );
}
