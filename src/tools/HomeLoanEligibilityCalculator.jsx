import { useEffect, useState } from 'react';
export default function HomeLoanEligibilityCalculator() {
    const [income, setIncome] = useState('6000');
    const [existingDebt, setExistingDebt] = useState('500');
    const [dtiRatio, setDtiRatio] = useState('36');
    const [rate, setRate] = useState('6.5');
    const [years, setYears] = useState('30');
    const [valid, setValid] = useState(true);
    const [maxTotalDebtPayment, setMaxTotalDebtPayment] = useState(0);
    const [maxMortgagePayment, setMaxMortgagePayment] = useState(0);
    const [maxLoanAmount, setMaxLoanAmount] = useState(0);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/home-loan-eligibility-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { income, existingDebt, dtiRatio, rate, years } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setMaxTotalDebtPayment(data.maxTotalDebtPayment || 0);
                        setMaxMortgagePayment(data.maxMortgagePayment || 0);
                        setMaxLoanAmount(data.maxLoanAmount || 0);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [income, existingDebt, dtiRatio, rate, years]);
    return (
        <div className="tool-page">
            <h1>Home Loan Eligibility Calculator</h1>
            <p className="tool-description">
                Estimate the maximum monthly mortgage payment and rough loan amount you could qualify for,
                based on your income, existing debts, and a target debt-to-income (DTI) ratio. This is a
                rough estimate - actual lender approval depends on many other factors. Runs entirely in
                your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Monthly income:
                    <input type="number" min={0} value={income} onChange={(e) => setIncome(e.target.value)} style={{ width: '100px' }} />
                </label>
                <label>
                    Existing monthly debt payments:
                    <input type="number" min={0} value={existingDebt} onChange={(e) => setExistingDebt(e.target.value)} style={{ width: '100px' }} />
                </label>
                <label>
                    Max debt-to-income ratio (%):
                    <input type="number" min={0} max={100} value={dtiRatio} onChange={(e) => setDtiRatio(e.target.value)} style={{ width: '70px' }} />
                </label>
                <label>
                    Interest rate (%/yr):
                    <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '80px' }} />
                </label>
                <label>
                    Loan term (years):
                    <input type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} style={{ width: '70px' }} />
                </label>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive income, a non-negative existing debt, a DTI ratio between 0-100%, a non-negative rate, and a positive term.
                </div>
            )}
            {valid && (
                <div className="timestamp-result">
                    <div>
                        <strong>Max total debt payment allowed:</strong> {maxTotalDebtPayment.toFixed(2)} /month
                    </div>
                    <div>
                        <strong>Max affordable mortgage payment:</strong> {maxMortgagePayment.toFixed(2)} /month
                    </div>
                    <div>
                        <strong>Estimated max loan amount:</strong> {maxLoanAmount.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
