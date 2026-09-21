import { useMemo, useState } from 'react';
const FORMATS = {
  search: 'Search ad (headline + description)',
  social: 'Social ad'
};
function buildAdCopy({ format, product, offer, audience, cta }) {
  const p = product.trim() || '[product/service]';
  const o = offer.trim() || '[offer details]';
  const a = audience.trim() || '[target audience]';
  const c = cta.trim() || '[call to action]';
  if (format === FORMATS.search) {
    return {
      headline: `${p} - ${o}`.slice(0, 60),
      description: `Attention ${a}: discover ${p}. ${o} Act now - ${c}.`.slice(0, 160)
    };
  }
  return {
    attention: `Hey ${a} - meet ${p}.`,
    interest: `Here's why it matters: ${p} solves a real problem, and right now ${o}.`,
    desire: `Imagine the difference ${p} could make for you.`,
    action: `${c} today.`
  };
}
export default function AdCopyTemplateGenerator() {
  const [format, setFormat] = useState(FORMATS.search);
  const [product, setProduct] = useState('');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [cta, setCta] = useState('');
  const [copied, setCopied] = useState(false);
  const copy = useMemo(
    () => buildAdCopy({ format, product, offer, audience, cta }),
    [format, product, offer, audience, cta]
  );
  const fullText =
    format === FORMATS.search
      ? `Headline: ${copy.headline}\nDescription: ${copy.description}`
      : `Attention: ${copy.attention}\nInterest: ${copy.interest}\nDesire: ${copy.desire}\nAction: ${copy.action}`;
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
        Pick an ad format and enter your product/offer details to fill a proven ad-copy structure
        (AIDA: Attention, Interest, Desire, Action for social; headline + description for search).
        This is a template generator, not AI-written copy - edit the result before publishing. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Format:
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value={FORMATS.search}>{FORMATS.search}</option>
            <option value={FORMATS.social}>{FORMATS.social}</option>
          </select>
        </label>
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy copy'}</button>
      </div>
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
      {format === FORMATS.search ? (
        <div className="timestamp-result">
          <span>
            <strong>Headline ({copy.headline.length}/60):</strong> {copy.headline}
          </span>
          <span>
            <strong>Description ({copy.description.length}/160):</strong> {copy.description}
          </span>
        </div>
      ) : (
        <div className="timestamp-result">
          <span>
            <strong>Attention:</strong> {copy.attention}
          </span>
          <span>
            <strong>Interest:</strong> {copy.interest}
          </span>
          <span>
            <strong>Desire:</strong> {copy.desire}
          </span>
          <span>
            <strong>Action:</strong> {copy.action}
          </span>
        </div>
      )}
    </div>
  );
}
