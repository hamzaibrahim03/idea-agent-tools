import { useState } from 'react';
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
function threeDigitsToWords(n) {
  const parts = [];
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (remainder) {
    if (remainder < 20) {
      parts.push(ONES[remainder]);
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      parts.push(ones ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens]);
    }
  }
  return parts.join(' ');
}
function integerToWords(n) {
  if (n === 0) return 'Zero';
  const groups = [];
  let remaining = n;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }
  const words = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    const groupWords = threeDigitsToWords(groups[i]);
    words.push(SCALES[i] ? `${groupWords} ${SCALES[i]}` : groupWords);
  }
  return words.join(' ');
}
function amountToWords(amount, currency) {
  const negative = amount < 0;
  const absAmount = Math.abs(amount);
  const totalCents = Math.round(absAmount * 100);
  const dollars = Math.floor(totalCents / 100);
  const cents = totalCents % 100;
  const dollarWords = integerToWords(dollars);
  const centsStr = String(cents).padStart(2, '0');
  const sentence = `${dollarWords} and ${centsStr}/100 ${currency}`;
  return negative ? `Negative ${sentence}` : sentence;
}
export default function MoneyToWordsConverter() {
  const [amount, setAmount] = useState('1234.56');
  const [currency, setCurrency] = useState('dollars');
  const [copied, setCopied] = useState(false);
  const numeric = Number(amount);
  const valid = amount.trim() !== '' && Number.isFinite(numeric) && Math.abs(numeric) < 1e15;
  const words = valid ? amountToWords(numeric, currency) : '';
  async function handleCopy() {
    if (!words) return;
    try {
      await navigator.clipboard.writeText(words);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Money to Words Converter</h1>
      <p className="tool-description">
        Convert a currency amount into its written-out form, suitable for checks and legal
        documents (e.g. "One Thousand Two Hundred Thirty-Four and 56/100 dollars"). Runs entirely
        in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Amount:
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1234.56"
            style={{ width: '140px' }}
          />
        </label>
        <label>
          Currency word:
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ width: '110px' }}
          />
        </label>
        <button onClick={handleCopy} disabled={!words}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {!valid && <div className="tool-error">Enter a valid numeric amount.</div>}
      {valid && (
        <div className="tool-panel">
          <label htmlFor="words-output">Written out</label>
          <textarea id="words-output" value={words} readOnly />
        </div>
      )}
    </div>
  );
}
