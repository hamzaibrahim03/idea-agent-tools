import { useState } from 'react';
const COMMANDS = [
  { category: 'Branching', cmd: 'git branch', desc: 'List, create, or delete branches' },
  { category: 'Branching', cmd: 'git branch <name>', desc: 'Create a new branch' },
  { category: 'Branching', cmd: 'git checkout -b <name>', desc: 'Create and switch to a new branch' },
  { category: 'Branching', cmd: 'git switch <name>', desc: 'Switch to an existing branch' },
  { category: 'Branching', cmd: 'git branch -d <name>', desc: 'Delete a branch (safe, only if merged)' },
  { category: 'Branching', cmd: 'git merge <branch>', desc: 'Merge the given branch into the current branch' },
  { category: 'Committing', cmd: 'git add <file>', desc: 'Stage a file for the next commit' },
  { category: 'Committing', cmd: 'git add .', desc: 'Stage all changed files in the current directory' },
  { category: 'Committing', cmd: 'git commit -m "message"', desc: 'Commit staged changes with a message' },
  { category: 'Committing', cmd: 'git status', desc: 'Show staged, unstaged, and untracked changes' },
  { category: 'Committing', cmd: 'git diff', desc: 'Show unstaged changes line by line' },
  { category: 'Committing', cmd: 'git log', desc: 'Show commit history' },
  { category: 'Remote', cmd: 'git clone <url>', desc: 'Copy a remote repository to your machine' },
  { category: 'Remote', cmd: 'git push', desc: 'Upload local commits to the remote repository' },
  { category: 'Remote', cmd: 'git pull', desc: 'Fetch and merge changes from the remote' },
  { category: 'Remote', cmd: 'git fetch', desc: 'Download remote changes without merging' },
  { category: 'Remote', cmd: 'git remote -v', desc: 'List configured remote repositories' },
  { category: 'Undoing changes', cmd: 'git restore <file>', desc: 'Discard uncommitted changes to a file' },
  { category: 'Undoing changes', cmd: 'git reset <file>', desc: 'Unstage a file, keeping its changes' },
  { category: 'Undoing changes', cmd: 'git reset --hard <commit>', desc: 'Reset working directory and history to a commit (destructive)' },
  { category: 'Undoing changes', cmd: 'git revert <commit>', desc: 'Create a new commit that undoes a previous commit' },
  { category: 'Undoing changes', cmd: 'git stash', desc: 'Temporarily shelve uncommitted changes' },
  { category: 'Undoing changes', cmd: 'git stash pop', desc: 'Reapply the most recently stashed changes' }
];
export default function GitCommandReference() {
  const [query, setQuery] = useState('');
  const filtered = COMMANDS.filter((c) => {
    const q = query.toLowerCase();
    return !q || c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
  });
  const grouped = filtered.reduce((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});
  return (
    <div className="tool-page">
      <h1>Git Command Reference</h1>
      <p className="tool-description">
        A searchable reference table of common git commands grouped by category - branching,
        committing, remote operations, and undoing changes - with syntax and a one-line explanation
        for each. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands (e.g. stash, merge, undo)"
          style={{ flex: 1, minWidth: 220, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text-h)' }}
        />
      </div>
      {Object.keys(grouped).length === 0 && <p className="tool-placeholder">No commands match your search.</p>}
      {Object.entries(grouped).map(([category, cmds]) => (
        <div key={category} className="tool-panel">
          <label>{category}</label>
          <div style={{ overflowX: 'auto' }}>
            <table className="regex-groups-table">
              <tbody>
                {cmds.map((c) => (
                  <tr key={c.cmd}>
                    <td><code>{c.cmd}</code></td>
                    <td>{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
