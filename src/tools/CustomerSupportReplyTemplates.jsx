import { useEffect, useState } from 'react';
const SCENARIOS = {
    refund: 'Refund request',
    shipping_delay: 'Shipping delay',
    product_defect: 'Product defect',
    general: 'General inquiry'
};
export default function CustomerSupportReplyTemplates() {
    const [scenario, setScenario] = useState(SCENARIOS.refund);
    const [customerName, setCustomerName] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [issue, setIssue] = useState('');
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setError('');
            fetch('/api/tools/customer-support-reply-templates', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { scenario, customerName, orderNumber, issue } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) setError(data.error);
                    else setOutput(data.output || '');
                })
                .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [scenario, customerName, orderNumber, issue]);
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Customer Support Reply Templates</h1>
            <p className="tool-description">
                Pick a scenario and fill in the customer name, order number, and specific issue to fill a
                template reply. This is a template generator, not AI-written support content - review and
                personalize before sending.
            </p>
            <div className="tool-controls">
                <label>
                    Scenario:
                    <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
                        {Object.values(SCENARIOS).map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy reply'}</button>
            </div>
            {error && <div className="agent-error">{error}</div>}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="cs-name">Customer name</label>
                    <input id="cs-name" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Alex" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="cs-order">Order number</label>
                    <input id="cs-order" type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. #10234" />
                </div>
            </div>
            <div className="tool-panel">
                <label htmlFor="cs-issue">Specific issue</label>
                <input id="cs-issue" type="text" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. item arrived with a cracked case" />
            </div>
            <div className="tool-panel">
                <label htmlFor="cs-output">Generated reply</label>
                <textarea id="cs-output" value={output} readOnly style={{ minHeight: 220 }} />
            </div>
        </div>
    );
}
