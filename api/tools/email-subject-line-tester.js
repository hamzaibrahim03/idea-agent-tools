import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ subject }) {
  return analyze(subject || '');
}

export default createComputeHandler(compute);
