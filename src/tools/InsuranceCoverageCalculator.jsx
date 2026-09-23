import { useEffect, useState } from 'react';
export default function InsuranceCoverageCalculator() {
    const [bill, setBill] = useState('2000');
    const [deductibleRemaining, setDeductibleRemaining] = useState('500');
    const [coinsurance, setCoinsurance] = useState('20');
    const [oopMax, setOopMax] = useState('5000');
    const [oopSpent, setOopSpent] = useState('0');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/insurance-coverage-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { bill, deductibleRemaining, coinsurance, oopMax, oopSpent } })
            })
                .then((r) => r.json())
                .then((d) => {
                    if (cancelled) return;
                    if (d.error) { setError(d.error); setData(null); }
                    else setData(d);
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [bill, deductibleRemaining, coinsurance, oopMax, oopSpent]);
    const result = data?.result;
    return (
        <div className="tool-page">
            <h1>Insurance Coverage Calculator</h1>
            <p className="tool-description">
                Estimate how a medical bill splits between you and your insurer, using standard health
                insurance math: you pay up to your remaining deductible, then a coinsurance percentage
                applies until you reach your out-of-pocket max, after which insurance covers the rest.
            </p>
            <div className="tool-error">
                <strong>Not medical or insurance advice:</strong> This is illustrative math based on a
                simplified standard plan structure. Actual insurance plans have varying rules, exclusions,
                and network considerations. Confirm real figures with your insurance provider.
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="ic-bill">Medical bill amount ($)</label>
                    <input id="ic-bill" type="number" min={0} value={bill} onChange={(e) => setBill(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ic-deductible">Deductible remaining ($)</label>
                    <input id="ic-deductible" type="number" min={0} value={deductibleRemaining} onChange={(e) => setDeductibleRemaining(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ic-coinsurance">Coinsurance (% you pay after deductible)</label>
                    <input id="ic-coinsurance" type="number" min={0} max={100} value={coinsurance} onChange={(e) => setCoinsurance(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ic-oop-max">Annual out-of-pocket max ($)</label>
                    <input id="ic-oop-max" type="number" min={0} value={oopMax} onChange={(e) => setOopMax(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ic-oop-spent">Out-of-pocket already spent this year ($)</label>
                    <input id="ic-oop-spent" type="number" min={0} value={oopSpent} onChange={(e) => setOopSpent(e.target.value)} />
                </div>
            </div>
            {error && (
                <div className="tool-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {result && (
                <div className="timestamp-result">
                    <div>
                        <strong>You owe:</strong> ${result.patientPays.toFixed(2)}
                    </div>
                    <div>
                        <strong>Insurance pays:</strong> ${result.insurancePays.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
