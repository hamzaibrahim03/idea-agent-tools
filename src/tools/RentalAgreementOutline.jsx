import { useState } from 'react';
export default function RentalAgreementOutline() {
  const [landlord, setLandlord] = useState('');
  const [tenant, setTenant] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [termLength, setTermLength] = useState('12 months');
  const [deposit, setDeposit] = useState('');
  const [copied, setCopied] = useState(false);
  function buildOutline() {
    const landlordName = landlord || '[Landlord Name]';
    const tenantName = tenant || '[Tenant Name]';
    const propertyAddress = address || '[Property Address]';
    const rentAmount = rent || '[Rent Amount]';
    const depositAmount = deposit || '[Deposit Amount]';
    return [
      'RESIDENTIAL RENTAL AGREEMENT - OUTLINE',
      '',
      `1. Parties: This agreement is between ${landlordName} ("Landlord") and ${tenantName} ("Tenant").`,
      '',
      `2. Property: The Landlord agrees to rent to the Tenant the property located at ${propertyAddress}.`,
      '',
      `3. Term: This agreement begins on the move-in date and continues for a term of ${termLength}.`,
      '',
      `4. Rent: Tenant agrees to pay ${rentAmount} per month, due on an agreed date each month, by an agreed payment method.`,
      '',
      `5. Security Deposit: Tenant agrees to pay a security deposit of ${depositAmount}, refundable subject to the condition of the property at move-out, per applicable local law.`,
      '',
      '6. Use of Property: The property is to be used as a private residence only, for the named Tenant(s) and any additional occupants disclosed and approved in writing.',
      '',
      '7. Maintenance and Repairs: Landlord is responsible for major repairs and maintaining the property in habitable condition; Tenant is responsible for reporting issues promptly and avoiding damage beyond normal wear and tear.',
      '',
      '8. Utilities: Specify which utilities (electricity, water, gas, internet, etc.) are the responsibility of Landlord vs Tenant.',
      '',
      '9. Rules and Restrictions: Include any rules on pets, smoking, subletting, alterations, and noise.',
      '',
      '10. Termination and Renewal: Describe notice periods required to end or renew the tenancy, and conditions for early termination.',
      '',
      '11. Governing Law: This agreement is governed by the laws of the applicable state/jurisdiction.',
      '',
      '12. Signatures: Both parties sign and date the agreement to indicate acceptance of these terms.'
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
      <h1>Rental Agreement Outline Generator</h1>
      <p className="tool-description">
        Fill in the basic details below to generate a plain-language outline of the sections a
        typical residential rental agreement contains, with your entered values filled in. Runs
        entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not a legal document:</strong> This is an educational outline only, not a legally
        binding rental agreement. Requirements vary by jurisdiction. Consult a qualified lawyer or
        use a proper legal document service to create an actual lease.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ra-landlord">Landlord name</label>
          <input id="ra-landlord" type="text" value={landlord} onChange={(e) => setLandlord(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-tenant">Tenant name</label>
          <input id="ra-tenant" type="text" value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="John Smith" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-address">Property address</label>
          <input id="ra-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Springfield" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-rent">Monthly rent amount</label>
          <input id="ra-rent" type="text" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="$1,500" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-term">Term length</label>
          <input id="ra-term" type="text" value={termLength} onChange={(e) => setTermLength(e.target.value)} placeholder="12 months" />
        </div>
        <div className="tool-panel">
          <label htmlFor="ra-deposit">Security deposit</label>
          <input id="ra-deposit" type="text" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="$1,500" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy outline'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated outline</label>
        <textarea readOnly value={outline} style={{ minHeight: 340 }} />
      </div>
    </div>
  );
}
