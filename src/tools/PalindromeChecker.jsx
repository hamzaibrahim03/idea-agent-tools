import { useEffect, useState } from 'react';
export default function PalindromeChecker() {
  const [input, setInput] = useState('');
  const [cleaned, setCleaned] = useState('');
  const [isPalindrome, setIsPalindrome] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/palindrome-checker', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else {
            setCleaned(data.cleaned);
            setIsPalindrome(data.isPalindrome);
          }
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
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
      {error && <div className="agent-error">{error}</div>}
      {!error && input.trim() && (
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
