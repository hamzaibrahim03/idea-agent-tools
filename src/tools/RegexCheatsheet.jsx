import { useState } from 'react';
const SECTIONS = [
  {
    title: 'Character classes',
    items: [
      ['.', 'Any character except newline'],
      ['\\d', 'Digit (0-9)'],
      ['\\D', 'Non-digit'],
      ['\\w', 'Word character (letter, digit, underscore)'],
      ['\\W', 'Non-word character'],
      ['\\s', 'Whitespace (space, tab, newline)'],
      ['\\S', 'Non-whitespace'],
      ['[abc]', 'Any of a, b, or c'],
      ['[^abc]', 'Not a, b, or c'],
      ['[a-z]', 'Any lowercase letter']
    ]
  },
  {
    title: 'Anchors',
    items: [
      ['^', 'Start of string (or line, with m flag)'],
      ['$', 'End of string (or line, with m flag)'],
      ['\\b', 'Word boundary'],
      ['\\B', 'Not a word boundary']
    ]
  },
  {
    title: 'Quantifiers',
    items: [
      ['*', '0 or more'],
      ['+', '1 or more'],
      ['?', '0 or 1 (also marks a group as lazy when after another quantifier)'],
      ['{n}', 'Exactly n times'],
      ['{n,}', 'n or more times'],
      ['{n,m}', 'Between n and m times']
    ]
  },
  {
    title: 'Groups & alternation',
    items: [
      ['(abc)', 'Capturing group'],
      ['(?:abc)', 'Non-capturing group'],
      ['(?<name>abc)', 'Named capturing group'],
      ['a|b', 'a or b'],
      ['(?=abc)', 'Positive lookahead'],
      ['(?!abc)', 'Negative lookahead'],
      ['(?<=abc)', 'Positive lookbehind'],
      ['(?<!abc)', 'Negative lookbehind']
    ]
  },
  {
    title: 'Flags',
    items: [
      ['g', 'Global - find all matches, not just the first'],
      ['i', 'Case-insensitive'],
      ['m', 'Multiline - ^ and $ match line boundaries'],
      ['s', 'Dot-all - . also matches newline'],
      ['u', 'Unicode - treats pattern as a sequence of Unicode code points']
    ]
  }
];
export default function RegexCheatsheet() {
  const [query, setQuery] = useState('');
  const [copiedItem, setCopiedItem] = useState('');
  const q = query.trim().toLowerCase();
  const filteredSections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(([token, desc]) => !q || token.toLowerCase().includes(q) || desc.toLowerCase().includes(q))
  })).filter((section) => section.items.length > 0);
  async function copyToken(token) {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedItem(token);
      setTimeout(() => setCopiedItem(''), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Regex Cheatsheet</h1>
      <p className="tool-description">
        A quick reference for common regular expression syntax - character classes, anchors,
        quantifiers, groups, and flags. Click any token to copy it. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="cheatsheet-search">Search</label>
        <input
          id="cheatsheet-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. lookahead, digit, boundary"
        />
      </div>
      {filteredSections.length === 0 && <p className="tool-placeholder">No matches for "{query}".</p>}
      {filteredSections.map((section) => (
        <div key={section.title} className="tool-panel">
          <label>{section.title}</label>
          <table className="regex-groups-table">
            <tbody>
              {section.items.map(([token, desc]) => (
                <tr key={token}>
                  <td>
                    <code onClick={() => copyToken(token)} style={{ cursor: 'pointer' }} title="Click to copy">
                      {copiedItem === token ? 'Copied!' : token}
                    </code>
                  </td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
