import { useState } from 'react';
const DATA_TYPES = [
  { key: 'email', label: 'Email address' },
  { key: 'name', label: 'Name' },
  { key: 'cookies', label: 'Cookies' },
  { key: 'analytics', label: 'Analytics/usage data' },
  { key: 'payment', label: 'Payment information' }
];
export default function PrivacyPolicyGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [collected, setCollected] = useState({ email: true, name: true, cookies: true, analytics: false, payment: false });
  const [copied, setCopied] = useState(false);
  function toggle(key) {
    setCollected((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function buildPolicy() {
    const name = businessName || '[Business Name]';
    const email = contactEmail || '[contact email]';
    const selectedTypes = DATA_TYPES.filter((t) => collected[t.key]).map((t) => t.label);
    return [
      `PRIVACY POLICY FOR ${name.toUpperCase()}`,
      '',
      '1. Introduction',
      `This Privacy Policy explains how ${name} collects, uses, and protects your information when you use our website/service.`,
      '',
      '2. Information We Collect',
      selectedTypes.length
        ? `We may collect the following types of information: ${selectedTypes.join(', ')}.`
        : 'Describe the categories of personal information you collect here.',
      '',
      '3. How We Use Your Information',
      'We use collected information to provide and improve our service, communicate with you, process transactions (if applicable), and comply with legal obligations.',
      '',
      '4. Cookies',
      collected.cookies
        ? 'We use cookies to remember your preferences, keep you signed in, and understand how our service is used. You can control cookies through your browser settings.'
        : 'Describe your cookie usage here, if any.',
      '',
      '5. Data Sharing',
      'We do not sell your personal information. We may share data with service providers who help us operate our service, or when required by law.',
      '',
      '6. Data Security',
      'We take reasonable measures to protect your information, but no method of transmission or storage is 100% secure.',
      '',
      '7. Your Rights',
      'Depending on your location, you may have rights to access, correct, or delete your personal information. Contact us to exercise these rights.',
      '',
      '8. Data Retention',
      'We retain personal information only as long as necessary for the purposes described in this policy or as required by law.',
      '',
      '9. Changes to This Policy',
      'We may update this policy from time to time. Continued use of our service after changes constitutes acceptance.',
      '',
      '10. Contact Us',
      `Questions about this policy can be sent to ${email}.`
    ].join('\n');
  }
  const policy = buildPolicy();
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(policy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Privacy Policy Generator</h1>
      <p className="tool-description">
        Fill in your business details and select the types of data you collect to assemble a
        starting privacy policy template with common sections. Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not legal advice:</strong> This is a starting template only. It must be reviewed
        and customized by a qualified lawyer before real use, and may not satisfy specific legal
        requirements (e.g. GDPR, CCPA) that apply to your business.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pp-name">Business name</label>
          <input id="pp-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div className="tool-panel">
          <label htmlFor="pp-email">Contact email</label>
          <input id="pp-email" type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="privacy@example.com" />
        </div>
      </div>
      <div className="tool-controls">
        <strong>Data collected:</strong>
        {DATA_TYPES.map((t) => (
          <label className="checkbox-label" key={t.key}>
            <input type="checkbox" checked={!!collected[t.key]} onChange={() => toggle(t.key)} />
            {t.label}
          </label>
        ))}
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy policy'}
        </button>
      </div>
      <div className="tool-panel">
        <label>Generated privacy policy</label>
        <textarea readOnly value={policy} style={{ minHeight: 380 }} />
      </div>
    </div>
  );
}
