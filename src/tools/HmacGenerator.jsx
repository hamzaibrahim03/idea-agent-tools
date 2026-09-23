import { useState, useEffect } from 'react';
const ALGORITHMS = ['SHA-256', 'SHA-1', 'SHA-384', 'SHA-512'];
export default function HmacGenerator() {
    const [message, setMessage] = useState('');
    const [key, setKey] = useState('');
    const [algorithm, setAlgorithm] = useState('SHA-256');
    const [hmac, setHmac] = useState('');
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!message || !key) {
            setHmac('');
            setError('');
            setFetchError('');
            return undefined;
        }
        let cancelled = false;
        setFetchError('');
        fetch('/api/tools/hmac-generator', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ input: { message, key, algorithm } })
        })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                if (data.error) {
                    setError(data.error);
                    setHmac('');
                } else {
                    setError('');
                    setHmac(data.hmac || '');
                }
            })
            .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        return () => {
            cancelled = true;
        };
    }, [message, key, algorithm]);
    async function handleCopy() {
        if (!hmac) return;
        try {
            await navigator.clipboard.writeText(hmac);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>HMAC Generator</h1>
            <p className="tool-description">
                Compute an HMAC (Hash-based Message Authentication Code) of a message using a secret key,
                via your browser's built-in Web Crypto API. Runs entirely in your browser - the message
                and key never leave your device.
            </p>
            <div className="tool-controls">
                <label>
                    Algorithm:
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                        {ALGORITHMS.map((a) => (
                            <option key={a} value={a}>
                                HMAC-{a.replace('-', '')}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={handleCopy} disabled={!hmac}>
                    {copied ? 'Copied!' : 'Copy HMAC'}
                </button>
            </div>
            <div className="tool-panel">
                <label htmlFor="hmac-key">Secret key</label>
                <input id="hmac-key" type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Secret key" spellCheck={false} />
            </div>
            <div className="tool-panel">
                <label htmlFor="hmac-message">Message</label>
                <textarea id="hmac-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message to authenticate" spellCheck={false} />
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="tool-panel">
                <label htmlFor="hmac-output">HMAC-{algorithm.replace('-', '')}</label>
                <input id="hmac-output" type="text" value={hmac} readOnly placeholder="Enter a message and key above" style={{ fontFamily: 'var(--mono)' }} />
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
}
