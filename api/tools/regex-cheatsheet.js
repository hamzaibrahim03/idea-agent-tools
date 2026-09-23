import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ query }) {
  const q = (query || '').trim().toLowerCase();
  const filteredSections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(([token, desc]) => !q || token.toLowerCase().includes(q) || desc.toLowerCase().includes(q))
  })).filter((section) => section.items.length > 0);
  return { sections: filteredSections };
}

export default createComputeHandler(compute);
