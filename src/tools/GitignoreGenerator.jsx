import { useEffect, useState } from 'react';
const GROUPS = {
    Languages: ['Node', 'Python', 'Java', 'Go', 'Rust', 'Ruby'],
    'Operating Systems': ['macOS', 'Windows', 'Linux'],
    Editors: ['VS Code', 'IntelliJ', 'Sublime Text'],
    Tools: ['Terraform', 'Docker']
};
export default function GitignoreGenerator() {
    const [selected, setSelected] = useState(new Set(['Node', 'macOS', 'VS Code']));
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [fetchError, setFetchError] = useState('');
    function toggle(name) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/gitignore-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { selected: [...selected] } })
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
    }, [selected]);
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
            <h1>.gitignore Generator</h1>
            <p className="tool-description">
                Select the stacks, operating systems, and editors your project uses to generate a combined
                .gitignore file from built-in templates. Runs entirely in your browser.
            </p>
            {Object.entries(GROUPS).map(([groupName, names]) => (
                <div className="tool-controls" key={groupName}>
                    <strong style={{ width: '140px' }}>{groupName}:</strong>
                    {names.map((name) => (
                        <label className="checkbox-label" key={name}>
                            <input type="checkbox" checked={selected.has(name)} onChange={() => toggle(name)} />
                            {name}
                        </label>
                    ))}
                </div>
            ))}
            <div className="tool-controls">
                <button onClick={handleCopy} disabled={!output}>
                    {copied ? 'Copied!' : 'Copy .gitignore'}
                </button>
                <button onClick={() => setSelected(new Set())} disabled={selected.size === 0}>
                    Clear selection
                </button>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="tool-panel">
                <label htmlFor="gitignore-output">Generated .gitignore</label>
                <textarea id="gitignore-output" value={output} readOnly spellCheck={false} placeholder="Select at least one stack above" />
            </div>
        </div>
    );
}
