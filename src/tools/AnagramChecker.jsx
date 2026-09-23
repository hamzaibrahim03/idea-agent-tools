import { useEffect, useState } from 'react';
export default function AnagramChecker() {
    const [inputA, setInputA] = useState('');
    const [inputB, setInputB] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/anagram-checker', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { inputA, inputB } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setResult(data);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [inputA, inputB]);
    return (
        <div className="tool-page">
            <h1>Anagram Checker</h1>
            <p className="tool-description">
                Check whether two phrases are anagrams of each other, ignoring case and spaces.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="anagram-input-a">Text A</label>
                    <input id="anagram-input-a" type="text" value={inputA} onChange={(e) => setInputA(e.target.value)} placeholder="e.g. listen" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="anagram-input-b">Text B</label>
                    <input id="anagram-input-b" type="text" value={inputB} onChange={(e) => setInputB(e.target.value)} placeholder="e.g. silent" />
                </div>
            </div>
            {error && <div className="agent-error">{error}</div>}
            {result?.ready && (
                <div className="timestamp-result">
                    <span>
                        <strong>Sorted letters (A):</strong> <code>{result.sortedA}</code>
                    </span>
                    <span>
                        <strong>Sorted letters (B):</strong> <code>{result.sortedB}</code>
                    </span>
                    <span>
                        <strong>Result:</strong> {result.isAnagram ? 'Yes, these are anagrams' : 'No, not anagrams'}
                    </span>
                </div>
            )}
        </div>
    );
}
