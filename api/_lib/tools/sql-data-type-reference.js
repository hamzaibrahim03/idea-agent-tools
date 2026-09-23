import { createComputeHandler } from '../computeHandler.js';

const TYPES = [
  { name: 'INT / INTEGER', mysql: '4 bytes, -2^31 to 2^31-1', postgres: '4 bytes, -2^31 to 2^31-1', sqlite: 'Variable (1-8 bytes, dynamic typing)', notes: 'Standard whole-number type' },
  { name: 'BIGINT', mysql: '8 bytes, -2^63 to 2^63-1', postgres: '8 bytes, -2^63 to 2^63-1', sqlite: 'Variable (up to 8 bytes)', notes: 'Use for large IDs or counters' },
  { name: 'SMALLINT', mysql: '2 bytes, -32768 to 32767', postgres: '2 bytes, -32768 to 32767', sqlite: 'Variable (dynamic typing)', notes: 'Space-efficient for small ranges' },
  { name: 'VARCHAR(n)', mysql: 'Up to 65,535 bytes', postgres: 'Up to 10,485,760 bytes', sqlite: 'No enforced limit (dynamic typing)', notes: 'Variable-length string with a max length' },
  { name: 'CHAR(n)', mysql: 'Fixed length, up to 255 chars', postgres: 'Fixed length, blank-padded', sqlite: 'Treated as TEXT (dynamic typing)', notes: 'Fixed-width string, padded with spaces' },
  { name: 'TEXT', mysql: 'Up to 65,535 bytes', postgres: 'Up to 1 GB', sqlite: 'No enforced limit', notes: 'Large variable-length text' },
  { name: 'DATE', mysql: "'1000-01-01' to '9999-12-31'", postgres: '4713 BC to 5874897 AD', sqlite: 'Stored as TEXT/REAL/INTEGER', notes: 'Calendar date, no time component' },
  { name: 'DATETIME / TIMESTAMP', mysql: "'1000-01-01' to '9999-12-31'", postgres: 'Microsecond precision', sqlite: 'Stored as TEXT/REAL/INTEGER', notes: 'Date and time combined' },
  { name: 'BOOLEAN', mysql: 'Stored as TINYINT(1)', postgres: 'True boolean type', sqlite: 'Stored as INTEGER (0/1)', notes: 'True/false flag' },
  { name: 'FLOAT / REAL', mysql: '4 bytes, approximate', postgres: '4 bytes, approximate (REAL)', sqlite: '8 bytes (floating point)', notes: 'Approximate decimal, avoid for currency' },
  { name: 'DECIMAL(p,s) / NUMERIC', mysql: 'Exact, up to 65 digits', postgres: 'Exact, up to 131072 digits', sqlite: 'Stored as TEXT/REAL (no native type)', notes: 'Exact precision - use for currency' },
  { name: 'BLOB', mysql: 'Up to 65,535 bytes', postgres: 'BYTEA, up to 1 GB', sqlite: 'No enforced limit', notes: 'Raw binary data' },
  { name: 'JSON', mysql: 'Native JSON type (5.7+)', postgres: 'JSON or JSONB (indexed)', sqlite: 'Stored as TEXT, JSON1 extension for queries', notes: 'Structured semi-structured data' },
  { name: 'UUID', mysql: 'No native type, use CHAR(36)', postgres: 'Native UUID type', sqlite: 'No native type, use TEXT', notes: 'Universally unique identifier' },
  { name: 'ENUM', mysql: 'Native ENUM type', postgres: 'Custom ENUM type via CREATE TYPE', sqlite: 'No native type, use TEXT + CHECK constraint', notes: 'Fixed set of allowed values' }
];

function compute({ query }) {
  const q = (query || '').toLowerCase();
  const filtered = TYPES.filter((t) => !q || t.name.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q));
  return { types: filtered };
}

export default createComputeHandler(compute);
