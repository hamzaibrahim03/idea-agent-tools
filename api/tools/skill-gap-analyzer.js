import { createComputeHandler } from '../_lib/computeHandler.js';

const ROLE_PRESETS = {
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design', 'TypeScript', 'Testing'],
  'Data Analyst': ['SQL', 'Excel', 'Python', 'Statistics', 'Data Visualization', 'Tableau', 'A/B Testing'],
  'Product Manager': ['Roadmapping', 'User Research', 'SQL', 'Agile', 'Stakeholder Management', 'Prioritization', 'Analytics'],
  'Digital Marketer': ['SEO', 'Content Strategy', 'Google Analytics', 'Email Marketing', 'Social Media', 'Copywriting', 'A/B Testing']
};

function parseSkills(text) {
  return [...new Set((text || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean))];
}

function compute({ currentSkillsText, preset, customTarget, useCustom }) {
  const targetSkillsText = useCustom ? customTarget : (ROLE_PRESETS[preset] || ROLE_PRESETS['Frontend Developer']).join(', ');
  const current = parseSkills(currentSkillsText);
  const target = parseSkills(targetSkillsText);
  const currentSet = new Set(current);
  const targetSet = new Set(target);
  const overlap = target.filter((s) => currentSet.has(s));
  const gap = target.filter((s) => !currentSet.has(s));
  const extra = current.filter((s) => !targetSet.has(s));
  return { overlap, gap, extra, targetCount: target.length, targetSkillsText, presets: Object.keys(ROLE_PRESETS) };
}

export default createComputeHandler(compute);
