import { createComputeHandler } from '../_lib/computeHandler.js';

function formatAlias(name, command) {
  const escaped = command.replace(/'/g, `'\\''`);
  return `alias ${name}='${escaped}'`;
}

function compute({ name, command }) {
  const nameValid = /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test((name || '').trim());
  const currentLine = (name || '').trim() && (command || '').trim() ? formatAlias((name || '').trim(), (command || '').trim()) : '';
  return { nameValid, currentLine };
}

export default createComputeHandler(compute);
