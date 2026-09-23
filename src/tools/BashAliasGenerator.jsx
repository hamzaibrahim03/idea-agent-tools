import { useEffect, useState } from 'react';
export default function BashAliasGenerator() {
    const [name, setName] = useState('');
    const [command, setCommand] = useState('');
    const [snippet, setSnippet] = useState('');
    const [copied, setCopied] = useState(false);
    const [nameValid, setNameValid] = useState(true);
    const [currentLine, setCurrentLine] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/bash-alias-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { name, command } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else {
                        setNameValid(data.nameValid);
                        setCurrentLine(data.currentLine || '');
                    }
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 200);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [name, command]);
    function addAlias() {
        if (!currentLine) return;
        setSnippet((s) => (s ? `${s}\n${currentLine}` : currentLine));
        setName('');
        setCommand('');
    }
    async function handleCopy() {
        if (!snippet) return;
        try {
            await navigator.clipboard.writeText(snippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Bash Alias Generator</h1>
            <p className="tool-description">
                Build shell aliases from a name and command, and accumulate them into a snippet ready to
                paste into your .bashrc or .zshrc.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="alias-name">
                        Alias name {name && !nameValid && <span className="tool-error-inline">Invalid characters</span>}
                    </label>
                    <input id="alias-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="gs" style={{ fontFamily: 'var(--mono)' }} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="alias-command">Command</label>
                    <input id="alias-command" type="text" value={command} onChange={(e) => setCommand(e.target.value)} placeholder="git status" style={{ fontFamily: 'var(--mono)' }} />
                </div>
            </div>
            <div className="tool-controls">
                <button onClick={addAlias} disabled={!currentLine || !nameValid}>Add to snippet</button>
                <button onClick={handleCopy} disabled={!snippet}>{copied ? 'Copied!' : 'Copy snippet'}</button>
                <button onClick={() => setSnippet('')} disabled={!snippet}>Clear snippet</button>
            </div>
            {currentLine && (
                <div className="tool-panel">
                    <label>Preview</label>
                    <input type="text" value={currentLine} readOnly style={{ fontFamily: 'var(--mono)' }} />
                </div>
            )}
            <div className="tool-panel">
                <label htmlFor="alias-snippet">.bashrc / .zshrc snippet</label>
                <textarea id="alias-snippet" value={snippet} readOnly spellCheck={false} placeholder="Added aliases will appear here" style={{ minHeight: 180, fontFamily: 'var(--mono)' }} />
            </div>
        </div>
    );
}
