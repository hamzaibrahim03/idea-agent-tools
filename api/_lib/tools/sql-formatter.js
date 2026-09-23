import { createComputeHandler } from '../computeHandler.js';

const CLAUSE_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
  'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'JOIN',
  'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'ON'
];
const SORTED_KEYWORDS = [...CLAUSE_KEYWORDS].sort((a, b) => b.length - a.length);

function formatSql(sql) {
  let normalized = sql.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  for (const kw of SORTED_KEYWORDS) {
    const regex = new RegExp(`\\s*\\b${kw.replace(' ', '\\s+')}\\b\\s*`, 'gi');
    normalized = normalized.replace(regex, `\n${kw} `);
  }
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const formatted = lines.map((line) => {
    const isSelect = /^SELECT\b/i.test(line);
    if (isSelect && line.includes(',')) {
      const [, rest] = line.split(/^SELECT\s+/i);
      const cols = rest.split(',').map((c) => c.trim());
      return `SELECT\n  ${cols.join(',\n  ')}`;
    }
    const clauseMatch = SORTED_KEYWORDS.find((kw) => new RegExp(`^${kw}\\b`, 'i').test(line));
    if (clauseMatch && line.length > clauseMatch.length) {
      return `${clauseMatch}\n  ${line.slice(clauseMatch.length).trim()}`;
    }
    return line;
  });
  return formatted.join('\n');
}

function compute({ input }) {
  return { formatted: formatSql(input || '') };
}

export default createComputeHandler(compute);
