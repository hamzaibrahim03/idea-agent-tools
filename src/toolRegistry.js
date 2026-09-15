import JsonFormatter from './tools/JsonFormatter.jsx';
import RegexTester from './tools/RegexTester.jsx';
import Base64Tool from './tools/Base64Tool.jsx';
import UuidGenerator from './tools/UuidGenerator.jsx';
import TimestampConverter from './tools/TimestampConverter.jsx';

// Single source of truth for every tool - drives both routing (App.jsx) and
// the homepage listing (Home.jsx). Add a new tool by adding one entry here
// plus its component file in src/tools/.
export const TOOLS = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and minify JSON instantly in your browser.',
    component: JsonFormatter
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test a regular expression against sample text with live match highlighting.',
    component: RegexTester
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode it back, with correct UTF-8/emoji handling.',
    component: Base64Tool
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate cryptographically-random UUIDs (v4), one or many at a time.',
    component: UuidGenerator
  },
  {
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    component: TimestampConverter
  }
];

export function getToolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug);
}
