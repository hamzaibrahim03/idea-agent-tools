import { useState } from 'react';
function clean(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}
export default function PalindromeChecker() {
  const [input, setInput] = useState('');
  const cleaned = clean(input);
  const isPalindrome = cleaned.length > 0 && cleaned === [...cleaned].reverse().join('');
  return (
    <div className="tool-page">
      <h1>Palindrome Checker</h1>
      <p className="tool-description">
        Check whether a phrase is a palindrome, ignoring case, spaces, and punctuation. Runs
        entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="palindrome-input">Text</label>
        <input
          id="palindrome-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. A man, a plan, a canal: Panama"
        />
      </div>
      {input.trim() && (
        <div className="timestamp-result">
          <span>
            <strong>Cleaned for comparison:</strong> <code>{cleaned || '(empty)'}</code>
          </span>
          <span>
            <strong>Result:</strong> {isPalindrome ? 'Yes, it’s a palindrome' : 'No, not a palindrome'}
          </span>
        </div>
      )}
    </div>
  );
}
