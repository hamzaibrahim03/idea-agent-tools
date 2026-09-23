import { createComputeHandler } from '../_lib/computeHandler.js';

function compute({ name, title, email, phone, location, summary, experience, education, skills }) {
  const experienceList = Array.isArray(experience) ? experience : [];
  const educationList = Array.isArray(education) ? education : [];
  const skillList = (skills || '').split(',').map((s) => s.trim()).filter(Boolean);
  const lines = [];
  if (name) lines.push(name);
  if (title) lines.push(title);
  const contact = [email, phone, location].filter(Boolean).join(' | ');
  if (contact) lines.push(contact);
  if (summary) lines.push('', 'SUMMARY', summary);
  if (experienceList.some((e) => e.role || e.company)) {
    lines.push('', 'EXPERIENCE');
    experienceList.forEach((e) => {
      if (!e.role && !e.company) return;
      lines.push(`${e.role}${e.role && e.company ? ' - ' : ''}${e.company}${e.dates ? ` (${e.dates})` : ''}`);
      if (e.details) e.details.split('\n').forEach((d) => d.trim() && lines.push(`  - ${d.trim()}`));
    });
  }
  if (educationList.some((e) => e.school || e.degree)) {
    lines.push('', 'EDUCATION');
    educationList.forEach((e) => {
      if (!e.school && !e.degree) return;
      lines.push(`${e.degree}${e.degree && e.school ? ' - ' : ''}${e.school}${e.dates ? ` (${e.dates})` : ''}`);
    });
  }
  if (skillList.length) lines.push('', 'SKILLS', skillList.join(', '));
  return { plainText: lines.join('\n') };
}

export default createComputeHandler(compute);
