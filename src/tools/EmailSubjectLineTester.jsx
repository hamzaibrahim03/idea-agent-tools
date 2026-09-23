import { useMemo, useState } from 'react';
const SPAM_WORDS = [
  'free', 'guarantee', 'guaranteed', 'act now', 'limited time', 'buy now',
  'click here', 'urgent', 'winner', 'cash', 'risk-free', '100% free',
  'no obligation', 'call now', 'once in a lifetime', 'cheap'
];
function analyze(subject) {
  const trimmed = subject.trim();
  const length = trimmed.length;
  const isAllCaps = /[A-Z]/.test(trimmed) && trimmed === trimmed.toUpperCase() && /[A-Za-z]/.test(trimmed);
  const lower = trimmed.toLowerCase();
  const foundSpamWords = SPAM_WORDS.filter((w) => lower.includes(w));
  const hasPersonalization = /\{.*?\}|\[.*?\]|%\w+%/.test(trimmed);
  const hasEmoji = /\p{Extended_Pictographic}/u.test(trimmed);
  const excessivePunctuation = /[!?]{2,}/.test(trimmed);
  const checks = [
    { label: `Length is 30-60 characters (yours: ${length})`, pass: length >= 30 && length <= 60 },
    { label: 'Not written in ALL CAPS', pass: !isAllCaps },
    { label: `No common spam-trigger words${foundSpamWords.length ? ` (found: ${foundSpamWords.join(', ')})` : ''}`, pass: foundSpamWords.length === 0 },
    { label: 'Includes a personalization token (e.g. {name})', pass: hasPersonalization },
    { label: 'No excessive punctuation (e.g. "!!" or "??")', pass: !excessivePunctuation }
  ];
  const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
  return { length, checks, score, hasEmoji };
}
export default function EmailSubjectLineTester() {
  const [subject, setSubject] = useState('');
  const result = useMemo(() => analyze(subject), [subject]);
  return (
    <div className="tool-page">
      <h1>Email Subject Line Tester</h1>
      <p className="tool-description">
        Paste an email subject line to check it against common best-practice heuristics - length,
        ALL CAPS usage, spam-trigger words from a curated list, and personalization tokens. This is
        a heuristic checklist based on common guidance, not a real deliverability or spam-filter
        prediction. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="subject-input">Subject line</label>
        <input
          id="subject-input"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Your {name}, here's what's new this week"
        />
      </div>
      {subject.trim() ? (
        <>
          <div className="timestamp-result">
            <span>
              <strong>Heuristic score:</strong> {result.score}/100
            </span>
          </div>
          <ul className="uuid-list">
            {result.checks.map((c, i) => (
              <li key={i}>
                <span>{c.label}</span>
                <span className={c.pass ? '' : 'tool-error-inline'}>{c.pass ? 'Pass' : 'Flagged'}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="tool-placeholder">Enter a subject line to see the heuristic checklist.</p>
      )}
    </div>
  );
}
