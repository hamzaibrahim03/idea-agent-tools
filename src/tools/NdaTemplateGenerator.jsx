import { useState } from 'react';
export default function NdaTemplateGenerator() {
  const [disclosingParty, setDisclosingParty] = useState('');
  const [receivingParty, setReceivingParty] = useState('');
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('2 years');
  const [copied, setCopied] = useState(false);
  function buildOutline() {
    const disclosing = disclosingParty || '[Disclosing Party]';
    const receiving = receivingParty || '[Receiving Party]';
    const purposeText = purpose || '[purpose of the disclosure, e.g. evaluating a potential business relationship]';
    return [
      'NON-DISCLOSURE AGREEMENT - OUTLINE',
      '',
      `1. Parties: This agreement is between ${disclosing} ("Disclosing Party") and ${receiving} ("Receiving Party").`,
      '',
      `2. Purpose: The parties wish to exchange confidential information for the purpose of ${purposeText}.`,
      '',
      '3. Definition of Confidential Information: Describe what counts as confidential - e.g. business plans, technical data, customer lists, financials - and any exclusions (information already public, independently developed, or already known).',
      '',
      '4. Obligations of Receiving Party: Receiving Party agrees to keep the information confidential, use it only for the stated purpose, and not disclose it to third parties without consent.',
      '',
      `5. Term: This agreement, and the confidentiality obligations within it, remain in effect for ${duration} from the date of signing.`,
      '',
      '6. Exclusions: Information that is publicly available, independently developed, or rightfully received from a third party is typically excluded from confidentiality obligations.',
      '',
      '7. Return or Destruction of Materials: Upon request or termination, Receiving Party agrees to return or destroy all confidential materials.',
      '',
      '8. Remedies: Describe what happens if the agreement is breached (e.g. injunctive relief, damages).',
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
      <h1>NDA Template Generator</h1>
      <p className="tool-description">
        Fill in the basic details below to generate a structured non-disclosure agreement outline
        with your entered values filled in. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is an educational template only, not a legally
        binding document as-is. Consult a qualified lawyer before using any generated document.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="nda-disclosing">Disclosing party</label>
          <input id="nda-disclosing" type="text" value={disclosingParty} onChange={(e) => setDisclosingParty(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div className="tool-panel">
          <label htmlFor="nda-receiving">Receiving party</label>
          <input id="nda-receiving" type="text" value={receivingParty} onChange={(e) => setReceivingParty(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="tool-panel">
          <label htmlFor="nda-purpose">Purpose of disclosure</label>
          <input id="nda-purpose" type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="evaluating a potential partnership" />
        </div>
        <div className="tool-panel">
          <label htmlFor="nda-duration">Duration</label>
          <input id="nda-duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="2 years" />
        </div>
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
