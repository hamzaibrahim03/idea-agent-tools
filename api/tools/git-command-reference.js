import { createComputeHandler } from '../_lib/computeHandler.js';

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

function compute({ query }) {
  const q = (query || '').toLowerCase();
  const filtered = COMMANDS.filter((c) => {
    return !q || c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
  });
  const grouped = filtered.reduce((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});
  return { grouped };
}

export default createComputeHandler(compute);
