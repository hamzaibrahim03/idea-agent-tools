import { createComputeHandler } from '../computeHandler.js';

const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/;
const NAME_RE = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

function validatePackageJson(text) {
  const issues = [];
  const warnings = [];
  if (!text.trim()) {
    return { issues: ['No input provided'], warnings, parsed: null };
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { issues: [`Invalid JSON: ${e.message}`], warnings, parsed: null };
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { issues: ['Top-level value must be a JSON object'], warnings, parsed: null };
  }
  if (!data.name) {
    issues.push('Missing required field "name"');
  } else if (typeof data.name !== 'string') {
    issues.push('"name" must be a string');
  } else {
    if (data.name.length > 214) issues.push('"name" is longer than 214 characters');
    if (data.name !== data.name.toLowerCase()) issues.push('"name" must be lowercase');
    if (!NAME_RE.test(data.name)) {
      issues.push('"name" contains characters not allowed in npm package names');
    }
  }
  if (!data.version) {
    issues.push('Missing required field "version"');
  } else if (typeof data.version !== 'string') {
    issues.push('"version" must be a string');
  } else if (!SEMVER_RE.test(data.version)) {
    issues.push(`"version" ("${data.version}") is not a valid semantic version (expected e.g. 1.2.3)`);
  }
  if (data.private !== true) {
    if (!data.description) warnings.push('No "description" field (recommended for published packages)');
    if (!data.license) warnings.push('No "license" field (recommended for published packages)');
  }
  if (data.main && typeof data.main !== 'string') issues.push('"main" must be a string if present');
  if (data.scripts && (typeof data.scripts !== 'object' || Array.isArray(data.scripts))) {
    issues.push('"scripts" must be an object if present');
  }
  if (data.dependencies && (typeof data.dependencies !== 'object' || Array.isArray(data.dependencies))) {
    issues.push('"dependencies" must be an object if present');
  }
  if (data.devDependencies && (typeof data.devDependencies !== 'object' || Array.isArray(data.devDependencies))) {
    issues.push('"devDependencies" must be an object if present');
  }
  return { issues, warnings, parsed: data };
}

function compute({ input }) {
  return validatePackageJson(input || '');
}

export default createComputeHandler(compute);
