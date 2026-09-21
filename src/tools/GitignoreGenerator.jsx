import { useState } from 'react';
const TEMPLATES = {
  Node: '# Node\nnode_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n.pnpm-debug.log*\ndist/\nbuild/\n.env\n.env.local',
  Python: '# Python\n__pycache__/\n*.py[cod]\n*$py.class\n.venv/\nvenv/\nenv/\n*.egg-info/\ndist/\nbuild/\n.pytest_cache/\n.mypy_cache/',
  Java: '# Java\n*.class\n*.jar\n*.war\n*.ear\ntarget/\n.gradle/\nbuild/',
  Go: '# Go\n*.exe\n*.test\n*.out\nvendor/',
  Rust: '# Rust\n/target/\nCargo.lock',
  Ruby: '# Ruby\n*.gem\n.bundle/\nvendor/bundle/\nlog/\ntmp/',
  macOS: '# macOS\n.DS_Store\n.AppleDouble\n.LSOverride\n._*\n.Spotlight-V100\n.Trashes',
  Windows: '# Windows\nThumbs.db\nehthumbs.db\nDesktop.ini\n$RECYCLE.BIN/\n*.lnk',
  Linux: '# Linux\n*~\n.fuse_hidden*\n.directory\n.Trash-*',
  'VS Code': '# VS Code\n.vscode/*\n!.vscode/extensions.json',
  IntelliJ: '# IntelliJ\n.idea/\n*.iml\n*.iws\nout/',
  'Sublime Text': '# Sublime Text\n*.sublime-workspace\n*.sublime-project',
  Terraform: '# Terraform\n.terraform/\n*.tfstate\n*.tfstate.backup\n*.tfvars',
  Docker: '# Docker\n*.pid\ndocker-compose.override.yml'
};
const GROUPS = {
  Languages: ['Node', 'Python', 'Java', 'Go', 'Rust', 'Ruby'],
  'Operating Systems': ['macOS', 'Windows', 'Linux'],
  Editors: ['VS Code', 'IntelliJ', 'Sublime Text'],
  Tools: ['Terraform', 'Docker']
};
export default function GitignoreGenerator() {
  const [selected, setSelected] = useState(new Set(['Node', 'macOS', 'VS Code']));
  const [copied, setCopied] = useState(false);
  function toggle(name) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }
  const output = Object.keys(TEMPLATES)
    .filter((name) => selected.has(name))
    .map((name) => TEMPLATES[name])
    .join('\n\n');
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>.gitignore Generator</h1>
      <p className="tool-description">
        Select the stacks, operating systems, and editors your project uses to generate a combined
        .gitignore file from built-in templates. Runs entirely in your browser.
      </p>
      {Object.entries(GROUPS).map(([groupName, names]) => (
        <div className="tool-controls" key={groupName}>
          <strong style={{ width: '140px' }}>{groupName}:</strong>
          {names.map((name) => (
            <label className="checkbox-label" key={name}>
              <input type="checkbox" checked={selected.has(name)} onChange={() => toggle(name)} />
              {name}
            </label>
          ))}
        </div>
      ))}
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy .gitignore'}
        </button>
        <button onClick={() => setSelected(new Set())} disabled={selected.size === 0}>
          Clear selection
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="gitignore-output">Generated .gitignore</label>
        <textarea
          id="gitignore-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Select at least one stack above"
        />
      </div>
    </div>
  );
}
