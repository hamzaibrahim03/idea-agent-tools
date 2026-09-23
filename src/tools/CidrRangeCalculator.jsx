import { useEffect, useState } from 'react';
export default function CidrRangeCalculator() {
    const [input, setInput] = useState('10.0.0.0/28');
    const [page, setPage] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/cidr-range-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { input, page } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) { setError(data.error); setResult(null); }
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [input, page]);
    function handleInputChange(value) {
        setInput(value);
        setPage(0);
    }
    return (
        <div className="tool-page">
            <h1>CIDR Range Calculator</h1>
            <p className="tool-description">
                Enter a CIDR block (e.g. 10.0.0.0/24) to see its full address range. For small ranges
                (/28 or smaller) every individual IP is listed and paginated; larger ranges show only the
                first and last address, since listing millions of IPs isn't practical. For network,
                broadcast, and subnet mask details, see the IP Subnet Calculator.
            </p>
            <div className="tool-controls">
                <label>
                    CIDR block:
                    <input type="text" value={input} onChange={(e) => handleInputChange(e.target.value)} placeholder="10.0.0.0/24" style={{ width: '160px' }} />
                </label>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {result && !error && (
                <>
                    <div className="timestamp-result">
                        <div>
                            <strong>First address:</strong> <code>{result.firstAddress}</code>
                        </div>
                        <div>
                            <strong>Last address:</strong> <code>{result.lastAddress}</code>
                        </div>
                        <div>
                            <strong>Total addresses:</strong> {result.totalAddresses.toLocaleString()}
                        </div>
                    </div>
                    {result.isListable ? (
                        <div className="tool-panel">
                            <label>
                                All addresses (page {result.clampedPage + 1} of {result.totalPages})
                            </label>
                            <ul className="uuid-list">
                                {result.pageAddresses.map((addr) => (
                                    <li key={addr}>
                                        <code>{addr}</code>
                                    </li>
                                ))}
                            </ul>
                            <div className="tool-controls">
                                <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={result.clampedPage === 0}>
                                    Previous
                                </button>
                                <button onClick={() => setPage((p) => Math.min(result.totalPages - 1, p + 1))} disabled={result.clampedPage >= result.totalPages - 1}>
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="tool-placeholder">
                            This range has {result.totalAddresses.toLocaleString()} addresses - too many to list
                            individually. Use a /28 or smaller prefix to see a paginated address list.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
