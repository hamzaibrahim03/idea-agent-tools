import { useEffect, useState } from 'react';
const UNITS = ['px', 'rem', 'em', 'pt', '%'];
export default function CssUnitConverter() {
    const [value, setValue] = useState('16');
    const [fromUnit, setFromUnit] = useState('px');
    const [basePx, setBasePx] = useState('16');
    const [valid, setValid] = useState(true);
    const [results, setResults] = useState([]);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/css-unit-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { value, fromUnit, basePx } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setResults(data.results || []);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [value, fromUnit, basePx]);
    return (
        <div className="tool-page">
            <h1>CSS Unit Converter</h1>
            <p className="tool-description">
                Convert between CSS length units - px, rem, em, pt, and %. rem/em/% conversions use a
                configurable base font size (default 16px, the browser default). Runs entirely in your
                browser.
            </p>
            <div className="tool-controls">
                <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: '100px' }} />
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                    {UNITS.map((u) => (
                        <option key={u} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
                <label>
                    Base font size (px):
                    <input type="number" min={1} value={basePx} onChange={(e) => setBasePx(e.target.value)} style={{ width: '70px' }} />
                </label>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a valid number and a positive base font size.
                </div>
            )}
            {valid && results.length > 0 && (
                <ul className="uuid-list">
                    {results.map((r) => (
                        <li key={r.unit}>
                            <span>{r.unit}</span>
                            <code>{r.value}</code>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
