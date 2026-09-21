import { useState } from 'react';
export default function NoticeToVacateGenerator() {
  const [landlordName, setLandlordName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [address, setAddress] = useState('');
  const [vacateDate, setVacateDate] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('30 days');
  const [issuedBy, setIssuedBy] = useState('landlord');
  const [copied, setCopied] = useState(false);
  function buildNotice() {
    const landlord = landlordName || '[Landlord Name]';
    const tenant = tenantName || '[Tenant Name]';
    const propertyAddress = address || '[Property Address]';
    const date = vacateDate || '[Vacate Date]';
    const from = issuedBy === 'landlord' ? landlord : tenant;
    const to = issuedBy === 'landlord' ? tenant : landlord;
    return [
      'NOTICE TO VACATE',
      '',
      `From: ${from}`,
      `To: ${to}`,
      `Property Address: ${propertyAddress}`,
      '',
      `This letter serves as formal notice, in accordance with a notice period of ${noticePeriod}, that the tenancy at the above address will end.`,
      '',
      `Requested/required vacate date: ${date}`,
      '',
      issuedBy === 'landlord'
        ? `${tenant} is requested to vacate the premises, remove all personal belongings, and return all keys by the date above.`
        : `${tenant} intends to vacate the premises, remove all personal belongings, and return all keys by the date above.`,
      '',
      'Please contact us to arrange a move-out inspection and the return of any security deposit, subject to the condition of the property and the terms of the original rental agreement.',
      '',
      `Signed: ${from}`,
      'Date: ____________________'
    ].join('\n');
  }
  const notice = buildNotice();
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(notice);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Notice to Vacate Generator</h1>
      <p className="tool-description">
        Fill in the details below to generate a formatted notice-to-vacate letter template, usable
        by either a landlord or a tenant. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> Required notice periods and delivery methods vary by
        jurisdiction and lease terms. This is an educational template only - consult a qualified
        lawyer or local tenant/landlord resources before sending a real notice.
      </div>
      <div className="tool-controls">
        <label>
          Notice issued by:
          <select value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)}>
            <option value="landlord">Landlord</option>
            <option value="tenant">Tenant</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="nv-landlord">Landlord name</label>
          <input id="nv-landlord" type="text" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="nv-tenant">Tenant name</label>
          <input id="nv-tenant" type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="nv-address">Property address</label>
          <input id="nv-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="nv-date">Vacate date</label>
          <input id="nv-date" type="text" value={vacateDate} onChange={(e) => setVacateDate(e.target.value)} placeholder="October 31, 2026" />
        </div>
        <div className="tool-panel">
          <label htmlFor="nv-notice">Notice period</label>
          <input id="nv-notice" type="text" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} placeholder="30 days" />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy notice'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated notice</label>
        <textarea readOnly value={notice} style={{ minHeight: 280 }} />
      </div>
    </div>
  );
}
