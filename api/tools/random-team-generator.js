import { createComputeHandler } from '../_lib/computeHandler.js';
import { webcrypto } from 'node:crypto';

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = webcrypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeTeams(names, teamCount) {
  const shuffled = shuffle(names);
  const teams = Array.from({ length: teamCount }, () => []);
  shuffled.forEach((name, i) => {
    teams[i % teamCount].push(name);
  });
  return teams;
}

function compute({ names, teamCount }) {
  const list = Array.isArray(names) ? names : [];
  if (list.length === 0) {
    return { teams: [] };
  }
  const count = Math.min(Math.max(Number(teamCount) || 1, 1), Math.max(list.length, 1));
  return { teams: makeTeams(list, count) };
}

export default createComputeHandler(compute);
