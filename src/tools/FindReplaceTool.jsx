import { useEffect, useState } from 'react';
export default function FindReplaceTool() {
    const [input, setInput] = useState('');
    const [find, setFind] = useState('');
    const [replace, setReplace] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(true);
    const [useRegex, setUseRegex] = useState(false);
    const [replaceAll, setReplaceAll] = useState(true);
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState('');
    const [count, setCount] = useState(0);
    const [regexError, setRegexError] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/find-replace-tool', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, find, replace, caseSensitive, useRegex, replaceAll } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    setResult(data.result ?? input);
                    setCount(data.count || 0);
                    setRegexError(data.error || '');
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input, find, replace, caseSensitive, useRegex, replaceAll]);
    async function handleCopy() {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Find &amp; Replace</h1>
            <p className="tool-description">
                Paste text and find/replace across it, with optional case sensitivity, regex matching, and
                replace-all vs replace-first-only.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="fr-find">Find</label>
                    <input id="fr-find" type="text" value={find} onChange={(e) => setFind(e.target.value)} placeholder={useRegex ? 'e.g. \\d+' : 'e.g. cat'} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="fr-replace">Replace with</label>
                    <input id="fr-replace" type="text" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="e.g. dog" spellCheck={false} />
                </div>
            </div>
            <div className="tool-controls">
                <label className="checkbox-label">
                    <input type="checkbox" checked={caseSensitive} onChange={() => setCaseSensitive((v) => !v)} />
                    Case-sensitive
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={useRegex} onChange={() => setUseRegex((v) => !v)} />
                    Treat Find as regex
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={replaceAll} onChange={() => setReplaceAll((v) => !v)} />
                    Replace all (unchecked = first match only)
                </label>
                <button onClick={handleCopy} disabled={!result}>
                    {copied ? 'Copied!' : 'Copy output'}
                </button>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {regexError && (
                <div className="tool-error">
                    <strong>Invalid regex:</strong> {regexError}
                </div>
            )}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="fr-input">Input</label>
                    <textarea id="fr-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="fr-output">Result ({count} replacement{count === 1 ? '' : 's'})</label>
                    <textarea id="fr-output" value={result} readOnly spellCheck={false} />
                </div>
            </div>
        </div>
    );
}
