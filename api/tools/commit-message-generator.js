import { createComputeHandler } from '../_lib/computeHandler.js';

function buildCommitMessage({ type, scope, description, body, breaking, breakingDescription }) {
  if (!description.trim()) return '';
  const scopePart = scope.trim() ? `(${scope.trim()})` : '';
  const bangPart = breaking ? '!' : '';
  const header = `${type}${scopePart}${bangPart}: ${description.trim()}`;
  const parts = [header];
  if (body.trim()) parts.push(body.trim());
  if (breaking) {
    parts.push(`BREAKING CHANGE: ${breakingDescription.trim() || description.trim()}`);
  }
  return parts.join('\n\n');
}

function compute({ type, scope, description, body, breaking, breakingDescription }) {
  const message = buildCommitMessage({
    type: type || 'feat',
    scope: scope || '',
    description: description || '',
    body: body || '',
    breaking: !!breaking,
    breakingDescription: breakingDescription || ''
  });
  return { message };
}

export default createComputeHandler(compute);
