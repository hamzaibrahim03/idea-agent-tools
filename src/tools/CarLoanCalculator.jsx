import { useEffect, useState } from 'react';
export default function CarLoanCalculator() {
    const [price, setPrice] = useState('30000');
    const [downPayment, setDownPayment] = useState('3000');
    const [tradeIn, setTradeIn] = useState('0');
    const [rate, setRate] = useState('6.5');
    const [term, setTerm] = useState('60');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/car-loan-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { price, downPayment, tradeIn, rate, term } })
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
    }, [price, downPayment, tradeIn, rate, term]);
    const { valid, loanAmount, result } = data || {};
    return (
        <div className="tool-page">
            <h1>Car Loan Calculator</h1>
            <p className="tool-description">
                Estimate your monthly auto loan payment, total interest, and total cost after accounting
                for a down payment and trade-in value.
            </p>
            <div className="tool-controls">
                <label>
                    Vehicle price:
                    <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '110px' }} />
                </label>
                <label>
                    Down payment:
                    <input type="number" min={0} value={downPayment} onChange={(e) => setDownPayment(e.target.value)} style={{ width: '100px' }} />
                </label>
                <label>
                    Trade-in value:
                    <input type="number" min={0} value={tradeIn} onChange={(e) => setTradeIn(e.target.value)} style={{ width: '100px' }} />
                </label>
                <label>
                    Annual interest rate (%):
                    <input type="number" min={0} step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: '90px' }} />
                </label>
                <label>
                    Loan term (months):
                    <input type="number" min={0} value={term} onChange={(e) => setTerm(e.target.value)} style={{ width: '90px' }} />
                </label>
            </div>
            {error && <div className="agent-error">{error}</div>}
            {data && !valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive vehicle price and term, non-negative down payment/trade-in/rate, and
                    ensure the down payment plus trade-in doesn't exceed the vehicle price.
                </div>
            )}
            {result && (
                <div className="timestamp-result">
                    <div>
                        <strong>Loan amount:</strong> {loanAmount.toFixed(2)}
                    </div>
                    <div>
                        <strong>Monthly payment:</strong> {result.payment.toFixed(2)}
                    </div>
                    <div>
                        <strong>Total interest:</strong> {result.totalInterest.toFixed(2)}
                    </div>
                    <div>
                        <strong>Total cost of loan:</strong> {result.totalPayment.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
