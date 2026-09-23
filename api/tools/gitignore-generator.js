import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ selected }) {
  const selectedSet = new Set(selected || []);
  const output = Object.keys(TEMPLATES)
    .filter((name) => selectedSet.has(name))
    .map((name) => TEMPLATES[name])
    .join('\n\n');
  return { output };
}

export default createComputeHandler(compute);
