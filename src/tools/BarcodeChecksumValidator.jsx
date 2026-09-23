import { useEffect, useState } from 'react';
export default function BarcodeChecksumValidator() {
    const [code, setCode] = useState('4006381333931');
    const [generateBody, setGenerateBody] = useState('400638133393');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/barcode-checksum-validator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { code, generateBody } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) setError(d.error);
                    else setData(d);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [code, generateBody]);
    const result = data?.result;
    return (
        <div className="tool-page">
            <h1>Barcode Checksum Validator</h1>
            <p className="tool-description">
                Validate the check digit of an EAN-8, EAN-13, UPC-A, or GTIN-14 barcode, or compute the
                correct check digit for a barcode body.
            </p>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-panel">
                <label htmlFor="barcode-validate">Validate a full barcode (including check digit)</label>
                <input id="barcode-validate" type="text" value={code} onChange={(e) => setCode(e.target.value)} style={{ fontFamily: 'var(--mono)' }} />
            </div>
            {result?.error && <div className="tool-error">{result.error}</div>}
            {result && !result.error && (
                <div className="timestamp-result">
                    <div>
                        <strong>Length:</strong> {result.length} digits
                    </div>
                    <div>
                        <strong>Provided check digit:</strong> {result.providedCheck}
                    </div>
                    <div>
                        <strong>Expected check digit:</strong> {result.expectedCheck}
                    </div>
                    <div>
                        <strong>{result.valid ? '✓ Valid barcode' : '✗ Invalid - check digit does not match'}</strong>
                    </div>
                </div>
            )}
            <div className="tool-panel" style={{ marginTop: 24 }}>
                <label htmlFor="barcode-generate">Compute check digit for a barcode body (7, 11, 12, or 13 digits)</label>
                <input id="barcode-generate" type="text" value={generateBody} onChange={(e) => setGenerateBody(e.target.value)} style={{ fontFamily: 'var(--mono)' }} />
            </div>
            {generateBody.trim() && data && !data.generateValid && (
                <div className="tool-error">Body must be 7, 11, 12, or 13 digits.</div>
            )}
            {data?.generatedCheckDigit !== null && data?.generatedCheckDigit !== undefined && (
                <div className="timestamp-result">
                    <div>
                        <strong>Check digit:</strong> {data.generatedCheckDigit}
                    </div>
                    <div>
                        <strong>Full barcode:</strong> {data.generateClean}{data.generatedCheckDigit}
                    </div>
                </div>
            )}
        </div>
    );
}
