import { useState } from 'react';
export default function ContractOutlineGenerator() {
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [purpose, setPurpose] = useState('');
  const [terms, setTerms] = useState('');
  const [payment, setPayment] = useState('');
  const [duration, setDuration] = useState('');
  const [termination, setTermination] = useState('');
  const [copied, setCopied] = useState(false);
  function buildOutline() {
    const a = partyA || '[Party A]';
    const b = partyB || '[Party B]';
    return [
      'GENERIC CONTRACT - OUTLINE',
      '',
      `1. Parties: This agreement is between ${a} and ${b}.`,
      '',
      `2. Purpose: ${purpose || '[Describe the purpose/subject matter of this contract]'}`,
      '',
      `3. Terms: ${terms || '[Describe the key terms and obligations of each party]'}`,
      '',
      `4. Payment: ${payment || '[Describe payment amount, schedule, and method]'}`,
      '',
      `5. Duration: ${duration || '[Describe the term/duration of this contract]'}`,
      '',
      `6. Termination: ${termination || '[Describe conditions under which either party may terminate this contract, and required notice period]'}`,
      '',
      '7. Confidentiality: Describe any obligations to keep shared information confidential, if applicable.',
      '',
      '8. Dispute Resolution: Describe how disputes will be resolved (e.g. negotiation, mediation, arbitration, courts).',
      '',
      '9. Governing Law: This agreement is governed by the laws of the applicable state/jurisdiction.',
      '',
      '10. Signatures: Both parties sign and date to indicate acceptance.'
    ].join('\n');
  }
  const outline = buildOutline();
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(outline);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Contract Outline Generator</h1>
      <p className="tool-description">
        Fill in the basic details below to generate a generic contract structure outline - parties,
        purpose, terms, payment, duration, and termination - with your entered values filled in.
        Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is an educational template only, not a legally
        binding document as-is. Consult a qualified lawyer before using any generated document.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="co-a">Party A</label>
          <input id="co-a" type="text" value={partyA} onChange={(e) => setPartyA(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div className="tool-panel">
          <label htmlFor="co-b">Party B</label>
          <input id="co-b" type="text" value={partyB} onChange={(e) => setPartyB(e.target.value)} placeholder="Jane Doe" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="co-purpose">Purpose</label>
        <textarea id="co-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} style={{ minHeight: 60 }} />
      </div>
      <div className="tool-panel">
        <label htmlFor="co-terms">Key terms</label>
        <textarea id="co-terms" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ minHeight: 60 }} />
      </div>
      <div className="tool-panel">
        <label htmlFor="co-payment">Payment</label>
        <textarea id="co-payment" value={payment} onChange={(e) => setPayment(e.target.value)} style={{ minHeight: 60 }} />
      </div>
      <div className="tool-panel">
        <label htmlFor="co-duration">Duration</label>
        <input id="co-duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="12 months" />
      </div>
      <div className="tool-panel">
        <label htmlFor="co-termination">Termination clause</label>
        <textarea id="co-termination" value={termination} onChange={(e) => setTermination(e.target.value)} style={{ minHeight: 60 }} />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy outline'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated outline</label>
        <textarea readOnly value={outline} style={{ minHeight: 320 }} />
      </div>
    </div>
  );
}
