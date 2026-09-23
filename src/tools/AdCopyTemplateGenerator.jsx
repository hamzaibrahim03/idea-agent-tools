import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function AdCopyTemplateGenerator() {
    const [product, setProduct] = useState('');
    const [offer, setOffer] = useState('');
    const [audience, setAudience] = useState('');
    const [cta, setCta] = useState('');
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('ad-copy', 'Ad Copy Template Generator');
    const result = ai.result;
    const fullText = result?.fullCopy || '';
    async function handleGenerate() {
        await ai.generate({ product, offer, audience, cta });
    }
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Ad Copy Template Generator</h1>
            <p className="tool-description">
                Enter your product/offer details and click "Generate with AI" for genuinely AI-written ad
                copy built on the AIDA (Attention, Interest, Desire, Action) framework - free, no account
                needed (rate-limited to keep it free for everyone). Review and edit before publishing.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="ad-product">Product / service</label>
                    <input id="ad-product" type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. our project management app" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ad-offer">Offer</label>
                    <input id="ad-offer" type="text" value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="e.g. 30% off your first month" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ad-audience">Target audience</label>
                    <input id="ad-audience" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. small business owners" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="ad-cta">Call to action</label>
                    <input id="ad-cta" type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g. Start your free trial" />
                </div>
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !product.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button type="button" onClick={handleCopy} disabled={!fullText}>
                    {copied ? 'Copied!' : 'Copy copy'}
                </button>
                <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                    {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                </button>
            </div>
            {ai.showApiSetup && (
                <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
            )}
            {ai.error && <div className="agent-error">{ai.error}</div>}
            {result && (
                <div className="timestamp-result">
                    <span>
                        <strong>Headline:</strong> {result.headline}
                    </span>
                    <span>
                        <strong>Attention:</strong> {result.attention}
                    </span>
                    <span>
                        <strong>Interest:</strong> {result.interest}
                    </span>
                    <span>
                        <strong>Desire:</strong> {result.desire}
                    </span>
                    <span>
                        <strong>Action:</strong> {result.action}
                    </span>
                </div>
            )}
        </div>
    );
}
