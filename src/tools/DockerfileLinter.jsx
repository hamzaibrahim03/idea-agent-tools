import { useState } from 'react';
const RULES = [
  {
    name: 'Pinned base image version',
    check: (lines) => {
      const fromLines = lines.filter((l) => /^FROM\s+/i.test(l));
      const bad = fromLines.filter((l) => /:latest\b/i.test(l) || /^FROM\s+\S+$/i.test(l.trim()));
      return bad.length ? bad.map((l) => `Use a specific version tag instead of ":latest" or no tag: "${l.trim()}"`) : [];
    }
  },
  {
    name: 'Combine RUN commands',
    check: (lines) => {
      const runLines = lines.filter((l) => /^RUN\s+/i.test(l));
      return runLines.length > 3
        ? [`Found ${runLines.length} separate RUN commands - combine related ones with && to reduce image layers.`]
        : [];
    }
  },
  {
    name: 'Non-root USER',
    check: (lines) => {
      const hasUser = lines.some((l) => /^USER\s+/i.test(l));
      return hasUser ? [] : ['No USER instruction found - the container will run as root by default. Add a non-root USER.'];
    }
  },
  {
    name: 'Layer-cache-friendly COPY order',
    check: (lines) => {
      const copyIndexes = lines
        .map((l, i) => ({ l, i }))
        .filter(({ l }) => /^COPY\s+/i.test(l));
      const depFileIndex = copyIndexes.findIndex(({ l }) =>
        /package(-lock)?\.json|requirements\.txt|go\.(mod|sum)|Gemfile|Cargo\.toml/i.test(l)
      );
      const copyAllIndex = copyIndexes.findIndex(({ l }) => /^COPY\s+\.\s+/i.test(l.trim() + ' '));
      if (depFileIndex !== -1 && copyAllIndex !== -1 && depFileIndex > copyAllIndex) {
        return ['Put "COPY package.json" (or equivalent dependency manifest) before "COPY . ." so dependency layers can be cached.'];
      }
      if (depFileIndex === -1 && copyAllIndex !== -1) {
        return ['No separate COPY of a dependency manifest (package.json, requirements.txt, etc.) before "COPY . ." - this busts the dependency cache on every source change.'];
      }
      return [];
    }
  },
  {
    name: 'apt-get cache cleanup',
    check: (lines) => {
      const aptLines = lines.filter((l) => /apt-get install/i.test(l));
      const missingCleanup = aptLines.filter((l) => !/rm -rf \/var\/lib\/apt\/lists/i.test(l));
      return missingCleanup.length
        ? ['apt-get install found without cleaning up "/var/lib/apt/lists" in the same layer - this bloats the image.']
        : [];
    }
  },
  {
    name: 'ADD vs COPY',
    check: (lines) => {
      const addLines = lines.filter((l) => /^ADD\s+/i.test(l) && !/https?:\/\//i.test(l) && !/\.tar/i.test(l));
      return addLines.length ? ['Prefer COPY over ADD for plain files/directories - ADD has implicit tar extraction and URL-fetch behavior that can surprise.'] : [];
    }
  },
  {
    name: 'Explicit EXPOSE',
    check: (lines) => {
      const hasExpose = lines.some((l) => /^EXPOSE\s+/i.test(l));
      const hasFrom = lines.some((l) => /^FROM\s+/i.test(l));
      return hasFrom && !hasExpose ? ['No EXPOSE instruction found - consider documenting the port(s) your app listens on.'] : [];
    }
  },
  {
    name: 'Avoid latest-tag pip/npm installs without lockfile',
    check: (lines) => {
      const npmInstall = lines.some((l) => /npm install\b/i.test(l) && !/npm ci\b/i.test(l));
      return npmInstall ? ['Consider "npm ci" instead of "npm install" in a Dockerfile for reproducible, lockfile-exact installs.'] : [];
    }
  }
];
function lintDockerfile(text) {
  const lines = text.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
  const findings = [];
  for (const rule of RULES) {
    const warnings = rule.check(lines);
    for (const message of warnings) {
      findings.push({ rule: rule.name, message });
    }
  }
  return findings;
}
const SAMPLE_DOCKERFILE = `FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "server.js"]`;
export default function DockerfileLinter() {
  const [input, setInput] = useState(SAMPLE_DOCKERFILE);
  const findings = input.trim() ? lintDockerfile(input) : [];
  return (
    <div className="tool-page">
      <h1>Dockerfile Linter</h1>
      <p className="tool-description">
        Paste Dockerfile contents to run basic best-practice checks - pinned base image versions,
        combining RUN commands, adding a non-root USER, layer-cache-friendly COPY ordering, and
        more. These are simple line-pattern checks, not a full Dockerfile parser, so treat findings
        as suggestions rather than guarantees. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="dockerfile-input">Dockerfile contents</label>
        <textarea
          id="dockerfile-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="FROM node:20-alpine&#10;WORKDIR /app&#10;..."
          spellCheck={false}
        />
      </div>
      <div className="tool-panel">
        <label>
          Findings {input.trim() && <span className="tool-error-inline">{findings.length} warning{findings.length === 1 ? '' : 's'}</span>}
        </label>
        {!input.trim() && <p className="tool-placeholder">Paste a Dockerfile above to see findings.</p>}
        {input.trim() && findings.length === 0 && <p className="tool-placeholder">No issues found by these checks.</p>}
        {findings.length > 0 && (
          <ul className="uuid-list">
            {findings.map((f, i) => (
              <li key={i} style={{ alignItems: 'flex-start' }}>
                <div>
                  <strong>{f.rule}:</strong> {f.message}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
