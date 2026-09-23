import { createComputeHandler } from '../_lib/computeHandler.js';

// The running elapsed-time tick must stay client-side (Date.now() diff
// every 500ms — no meaningful per-tick input to send). Only the sessions
// summary (today's total, per-subject totals) is computed here, called
// whenever the sessions log changes (on Stop), not on every tick.
function compute({ sessions }) {
  const list = Array.isArray(sessions) ? sessions : [];
  const todayStr = new Date().toDateString();
  const totalTodayMs = list
    .filter((s) => new Date(s.endedAt).toDateString() === todayStr)
    .reduce((sum, s) => sum + s.durationMs, 0);
  const bySubject = [];
  for (const s of list) {
    const existing = bySubject.find((e) => e.subject === s.subject);
    if (existing) existing.totalMs += s.durationMs;
    else bySubject.push({ subject: s.subject, totalMs: s.durationMs });
  }
  return { totalTodayMs, bySubject };
}

export default createComputeHandler(compute);
