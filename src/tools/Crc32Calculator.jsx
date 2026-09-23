import { useState, useEffect } from 'react';
export default function Crc32Calculator() {
    const [input, setInput] = useState('123456789');
    const [copied, setCopied] = useState(false);
    const [hex, setHex] = useState('');
    const [checksum, setChecksum] = useState('');
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/crc32-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setFetchError(data.error);
                    else {
                        setHex(data.hex);
                        setChecksum(data.checksum);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input]);
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(hex);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>CRC-32 Calculator</h1>
            <p className="tool-description">
                Compute the CRC-32 (IEEE 802.3) checksum of text, the same algorithm used by ZIP, PNG,
                and Ethernet. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy checksum'}</button>
            </div>
            <div className="tool-panel">
                <label htmlFor="crc-input">Text</label>
                <textarea id="crc-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text" spellCheck={false} />
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="crc-hex">CRC-32 (hex)</label>
                    <input id="crc-hex" type="text" value={hex} readOnly style={{ fontFamily: 'var(--mono)' }} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="crc-dec">CRC-32 (decimal)</label>
                    <input id="crc-dec" type="text" value={checksum} readOnly style={{ fontFamily: 'var(--mono)' }} />
                </div>
            </div>
        </div>
    );
}
