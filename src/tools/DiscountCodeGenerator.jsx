import { useState } from 'react';
export default function DiscountCodeGenerator() {
    const [prefix, setPrefix] = useState('SAVE');
    const [length, setLength] = useState(6);
    const [charset, setCharset] = useState('alphanumeric');
    const [count, setCount] = useState(5);
    const [codes, setCodes] = useState([]);
    const [copied, setCopied] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    async function handleGenerate() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/tools/discount-code-generator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { prefix, length, charset, count } })
            });
            const data = await res.json();
            if (data.error) setError(data.error);
            else setCodes(data.codes || []);
        } catch (e) {
            setError(e.message || 'Failed to generate');
        } finally {
            setLoading(false);
        }
    }
    async function handleCopy(code) {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(code);
            setTimeout(() => setCopied(''), 1200);
        } catch {
        }
    }
    async function handleCopyAll() {
        if (codes.length === 0) return;
        try {
            await navigator.clipboard.writeText(codes.join('\n'));
            setCopied('__all__');
            setTimeout(() => setCopied(''), 1200);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Discount Code Generator</h1>
            <p className="tool-description">
                Generate random promo/discount codes using a cryptographically-random source. Configure
                a prefix, length, and character set, and generate one or many codes at once.
            </p>
            <div className="tool-controls">
                <label>
                    Prefix:
                    <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} style={{ width: '90px' }} />
                </label>
                <label>
                    Length:
                    <input type="number" min={2} max={20} value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: '60px' }} />
                </label>
                <label>
                    Character set:
                    <select value={charset} onChange={(e) => setCharset(e.target.value)}>
                        <option value="alphanumeric">Letters + digits</option>
                        <option value="letters">Letters only</option>
                        <option value="digits">Digits only</option>
                    </select>
                </label>
                <label>
                    How many:
                    <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: '60px' }} />
                </label>
            </div>
            <div className="tool-controls">
                <button onClick={handleGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
                <button onClick={handleCopyAll} disabled={codes.length === 0}>
                    {copied === '__all__' ? 'Copied!' : 'Copy all'}
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            {codes.length > 0 ? (
                <ul className="uuid-list">
                    {codes.map((code, i) => (
                        <li key={`${code}-${i}`}>
                            <code>{code}</code>
                            <button className="uuid-copy-btn" onClick={() => handleCopy(code)}>
                                {copied === code ? 'Copied!' : 'Copy'}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="tool-placeholder">Click Generate to create discount codes.</p>
            )}
        </div>
    );
}
