import { useState } from 'react';
export default function DecisionMaker() {
    const [mode, setMode] = useState('options');
    const [optionsText, setOptionsText] = useState('Pizza\nSushi\nTacos\nBurgers');
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const options = optionsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    async function handleDecide() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/tools/decision-maker', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { mode, options } })
            });
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResult(data.result);
        } catch (e) {
            setError(e.message || 'Failed to compute');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="tool-page">
            <h1>Decision Maker</h1>
            <p className="tool-description">
                Can't decide? Paste a list of options or ask a yes/no question, and this tool picks one at
                random using a cryptographically-random source. It's a fun decision-helper, not authoritative
                advice - the real choice is still yours.
            </p>
            <div className="tool-controls">
                <label>
                    Mode:
                    <select value={mode} onChange={(e) => { setMode(e.target.value); setResult(''); }}>
                        <option value="options">Pick from a list</option>
                        <option value="yesno">Yes / No / Maybe</option>
                    </select>
                </label>
                <button onClick={handleDecide} disabled={loading || (mode === 'options' && options.length === 0)}>
                    {loading ? 'Deciding...' : 'Decide for me'}
                </button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            {mode === 'options' ? (
                <div className="tool-panel">
                    <label htmlFor="options-input">Options (one per line)</label>
                    <textarea id="options-input" value={optionsText} onChange={(e) => setOptionsText(e.target.value)} placeholder={'Option A\nOption B\nOption C'} />
                </div>
            ) : (
                <div className="tool-panel">
                    <label htmlFor="question-input">Your question (optional, just for you)</label>
                    <input id="question-input" type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Should I get the tacos?" />
                </div>
            )}
            {mode === 'options' && options.length === 0 && (
                <div className="tool-error">Add at least one option.</div>
            )}
            {result && (
                <div className="timestamp-result">
                    <span style={{ fontSize: 24 }}>
                        <strong>{result}</strong>
                    </span>
                </div>
            )}
        </div>
    );
}
