import { createComputeHandler } from '../computeHandler.js';

function riskLevel(score) {
  if (score >= 15) return { label: 'Critical', className: 'risk-critical', color: '#7f1d1d', bg: 'rgba(127, 29, 29, 0.15)' };
  if (score >= 8) return { label: 'High', className: 'risk-high', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)' };
  if (score >= 4) return { label: 'Medium', className: 'risk-medium', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' };
  return { label: 'Low', className: 'risk-low', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.12)' };
}

function compute({ risks }) {
  const list = Array.isArray(risks) ? risks : [];
  const scored = list
    .map((r, originalIndex) => {
      const likelihood = Number(r.likelihood);
      const severity = Number(r.severity);
      const validRow =
        Number.isFinite(likelihood) && likelihood >= 1 && likelihood <= 5 &&
        Number.isFinite(severity) && severity >= 1 && severity <= 5;
      const score = validRow ? likelihood * severity : 0;
      const level = validRow ? riskLevel(score) : null;
      return { ...r, originalIndex, likelihood, severity, score, level, validRow };
    })
    .sort((a, b) => b.score - a.score);
  return { scored };
}

export default createComputeHandler(compute);
