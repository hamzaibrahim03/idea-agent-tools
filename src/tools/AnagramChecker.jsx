import { useState } from 'react';
function clean(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}
function sortedLetters(text) {
  return [...text].sort().join('');
}
export default function AnagramChecker() {
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const cleanedA = clean(inputA);
  const cleanedB = clean(inputB);
  const sortedA = sortedLetters(cleanedA);
  const sortedB = sortedLetters(cleanedB);
  const ready = cleanedA.length > 0 && cleanedB.length > 0;
  const isAnagram = ready && sortedA === sortedB;
  return (
    <div className="tool-page">
      <h1>Anagram Checker</h1>
      <p className="tool-description">
        Check whether two phrases are anagrams of each other, ignoring case and spaces. Runs
        entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="anagram-input-a">Text A</label>
          <input
            id="anagram-input-a"
            type="text"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            placeholder="e.g. listen"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="anagram-input-b">Text B</label>
          <input
            id="anagram-input-b"
            type="text"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            placeholder="e.g. silent"
          />
        </div>
      </div>
      {ready && (
        <div className="timestamp-result">
          <span>
            <strong>Sorted letters (A):</strong> <code>{sortedA}</code>
          </span>
          <span>
            <strong>Sorted letters (B):</strong> <code>{sortedB}</code>
          </span>
          <span>
            <strong>Result:</strong> {isAnagram ? 'Yes, these are anagrams' : 'No, not anagrams'}
          </span>
        </div>
      )}
    </div>
  );
}
