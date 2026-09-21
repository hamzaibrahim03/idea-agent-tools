import { useState } from 'react';
export default function TermsConditionsGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [offering, setOffering] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [accountsRequired, setAccountsRequired] = useState(true);
  const [paymentsAccepted, setPaymentsAccepted] = useState(true);
  const [copied, setCopied] = useState(false);
  function buildTerms() {
    const name = businessName || '[Business/Website Name]';
    const what = offering || '[products/services offered]';
    const email = contactEmail || '[contact email]';
    const sections = [
      `TERMS AND CONDITIONS FOR ${name.toUpperCase()}`,
      '',
      '1. Acceptance of Terms',
      `By accessing or using ${name}, you agree to be bound by these Terms and Conditions. If you do not agree, do not use our ${what}.`,
      '',
      '2. Description of Service',
      `${name} provides ${what}. We reserve the right to modify or discontinue any part of the service at any time.`
    ];
    if (accountsRequired) {
      sections.push(
        '',
        '3. User Accounts',
        'Certain features require creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.'
      );
    }
    if (paymentsAccepted) {
      sections.push(
        '',
        `${accountsRequired ? '4' : '3'}. Payments`,
        'Prices, billing terms, and refund policies for any paid offerings should be described here, including accepted payment methods and any recurring billing terms.'
      );
    }
    sections.push(
      '',
      '5. User Responsibilities',
      'You agree to use the service lawfully and not to misuse, disrupt, or attempt unauthorized access to the service.',
      '',
      '6. Intellectual Property',
      `All content, trademarks, and materials on ${name} are owned by us or our licensors unless otherwise stated.`,
      '',
      '7. Limitation of Liability',
      `${name} is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the service.`,
      '',
      '8. Termination',
      'We may suspend or terminate access to the service for violations of these terms.',
      '',
      '9. Governing Law',
      '[Governing law / jurisdiction placeholder]',
      '',
      '10. Changes to These Terms',
      'We may update these terms from time to time; continued use of the service after changes constitutes acceptance.',
      '',
      '11. Contact',
      `Questions about these terms can be sent to ${email}.`
    );
    return sections.join('\n');
  }
  const terms = buildTerms();
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(terms);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Terms &amp; Conditions Generator</h1>
      <p className="tool-description">
        Fill in your business details below to assemble a starting Terms and Conditions template
        with common sections - acceptance of terms, user responsibilities, limitation of liability,
        and a governing law placeholder. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is a starting template only. It must be reviewed
        and customized by a qualified lawyer before real use - it is not a substitute for legal
        advice.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="tc-name">Business/website name</label>
          <input id="tc-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div className="tool-panel">
          <label htmlFor="tc-offering">What you sell/offer</label>
          <input id="tc-offering" type="text" value={offering} onChange={(e) => setOffering(e.target.value)} placeholder="an online scheduling tool" />
        </div>
        <div className="tool-panel">
          <label htmlFor="tc-email">Contact email</label>
          <input id="tc-email" type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="support@example.com" />
        </div>
      </div>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={accountsRequired} onChange={(e) => setAccountsRequired(e.target.checked)} />
          User accounts required
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={paymentsAccepted} onChange={(e) => setPaymentsAccepted(e.target.checked)} />
          Payments accepted
        </label>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy terms'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated Terms &amp; Conditions</label>
        <textarea readOnly value={terms} style={{ minHeight: 380 }} />
      </div>
    </div>
  );
}
