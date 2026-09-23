import { useEffect, useState } from 'react';
const SAMPLE_DOCKERFILE = `FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "server.js"]`;
export default function DockerfileLinter() {
    const [input, setInput] = useState(SAMPLE_DOCKERFILE);
    const [findings, setFindings] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            if (!input.trim()) {
                setFindings([]);
                return;
            }
            fetch('/api/tools/dockerfile-linter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setFindings(data.findings || []);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 300);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input]);
    return (
        <div className="tool-page">
            <h1>Dockerfile Linter</h1>
            <p className="tool-description">
                Paste Dockerfile contents to run basic best-practice checks - pinned base image versions,
                combining RUN commands, adding a non-root USER, layer-cache-friendly COPY ordering, and
                more. These are simple line-pattern checks, not a full Dockerfile parser, so treat findings
                as suggestions rather than guarantees.
            </p>
            <div className="tool-panel">
                <label htmlFor="dockerfile-input">Dockerfile contents</label>
                <textarea id="dockerfile-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="FROM node:20-alpine&#10;WORKDIR /app&#10;..." spellCheck={false} />
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label>
                    Findings {input.trim() && <span className="tool-error-inline">{findings.length} warning{findings.length === 1 ? '' : 's'}</span>}
                </label>
                {!input.trim() && <p className="tool-placeholder">Paste a Dockerfile above to see findings.</p>}
                {input.trim() && findings.length === 0 && <p className="tool-placeholder">No issues found by these checks.</p>}
                {findings.length > 0 && (
                    <ul className="uuid-list">
                        {findings.map((f, i) => (
                            <li key={i} style={{ alignItems: 'flex-start' }}>
                                <div>
                                    <strong>{f.rule}:</strong> {f.message}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
