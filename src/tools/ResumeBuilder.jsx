import { useState } from 'react';
function emptyExperience() {
  return { role: '', company: '', dates: '', details: '' };
}
function emptyEducation() {
  return { school: '', degree: '', dates: '' };
}
export default function ResumeBuilder() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [experience, setExperience] = useState([emptyExperience()]);
  const [education, setEducation] = useState([emptyEducation()]);
  const [skills, setSkills] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  function updateExperience(i, field, value) {
    setExperience((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }
  function updateEducation(i, field, value) {
    setEducation((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }
  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  async function handleCopy() {
    setError('');
    try {
      const r = await fetch('/api/tools/resume-builder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { name, title, email, phone, location, summary, experience, education, skills } })
      });
      const data = await r.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      await navigator.clipboard.writeText(data.plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setError(e.message || 'Failed to compute');
    }
  }
  return (
    <div className="tool-page">
      <h1>Resume Builder</h1>
      <p className="tool-description">
        Fill in your contact details, summary, work experience, education, and skills to build a
        clean, printable resume layout below. Use your browser's print function or the copy button
        to export it. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button type="button" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy as plain text'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="rb-name">Full name</label>
          <input id="rb-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Smith" />
        </div>
        <div className="tool-panel">
          <label htmlFor="rb-title">Job title</label>
          <input id="rb-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Software Engineer" />
        </div>
        <div className="tool-panel">
          <label htmlFor="rb-email">Email</label>
          <input id="rb-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jordan@example.com" />
        </div>
        <div className="tool-panel">
          <label htmlFor="rb-phone">Phone</label>
          <input id="rb-phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
        </div>
        <div className="tool-panel">
          <label htmlFor="rb-location">Location</label>
          <input id="rb-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Austin, TX" />
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="rb-summary">Professional summary</label>
        <textarea
          id="rb-summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="A brief 2-3 sentence overview of your experience and strengths."
          style={{ minHeight: 80 }}
        />
      </div>
      <h2 style={{ fontSize: 18, margin: '20px 0 8px' }}>Work experience</h2>
      <div className="tool-controls">
        <button type="button" onClick={() => setExperience((prev) => [...prev, emptyExperience()])}>
          Add experience
        </button>
      </div>
      <ul className="uuid-list">
        {experience.map((e, i) => (
          <li key={i} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div className="tool-grid" style={{ marginBottom: 0 }}>
              <input type="text" placeholder="Role" value={e.role} onChange={(ev) => updateExperience(i, 'role', ev.target.value)} />
              <input type="text" placeholder="Company" value={e.company} onChange={(ev) => updateExperience(i, 'company', ev.target.value)} />
            </div>
            <input type="text" placeholder="Dates (e.g. 2021 - Present)" value={e.dates} onChange={(ev) => updateExperience(i, 'dates', ev.target.value)} />
            <textarea
              placeholder="Key achievements, one per line"
              value={e.details}
              onChange={(ev) => updateExperience(i, 'details', ev.target.value)}
              style={{ minHeight: 60 }}
            />
            <button
              type="button"
              className="uuid-copy-btn"
              onClick={() => setExperience((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={experience.length <= 1}
              style={{ alignSelf: 'flex-start' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h2 style={{ fontSize: 18, margin: '20px 0 8px' }}>Education</h2>
      <div className="tool-controls">
        <button type="button" onClick={() => setEducation((prev) => [...prev, emptyEducation()])}>
          Add education
        </button>
      </div>
      <ul className="uuid-list">
        {education.map((e, i) => (
          <li key={i} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div className="tool-grid" style={{ marginBottom: 0 }}>
              <input type="text" placeholder="Degree" value={e.degree} onChange={(ev) => updateEducation(i, 'degree', ev.target.value)} />
              <input type="text" placeholder="School" value={e.school} onChange={(ev) => updateEducation(i, 'school', ev.target.value)} />
            </div>
            <input type="text" placeholder="Dates" value={e.dates} onChange={(ev) => updateEducation(i, 'dates', ev.target.value)} />
            <button
              type="button"
              className="uuid-copy-btn"
              onClick={() => setEducation((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={education.length <= 1}
              style={{ alignSelf: 'flex-start' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="tool-panel">
        <label htmlFor="rb-skills">Skills (comma-separated)</label>
        <input id="rb-skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="JavaScript, React, SQL" />
      </div>
      <h2 style={{ fontSize: 18, margin: '24px 0 8px' }}>Preview</h2>
      <div className="timestamp-result" style={{ background: 'var(--bg)' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{name || 'Your Name'}</div>
        {title && <div>{title}</div>}
        <div style={{ opacity: 0.75 }}>{[email, phone, location].filter(Boolean).join(' | ')}</div>
        {summary && (
          <>
            <strong style={{ marginTop: 8 }}>Summary</strong>
            <div>{summary}</div>
          </>
        )}
        {experience.some((e) => e.role || e.company) && (
          <>
            <strong style={{ marginTop: 8 }}>Experience</strong>
            {experience.map((e, i) => (
              (e.role || e.company) && (
                <div key={i}>
                  <div>
                    <strong>{e.role}</strong>
                    {e.company ? ` - ${e.company}` : ''} {e.dates ? `(${e.dates})` : ''}
                  </div>
                  {e.details.split('\n').filter((d) => d.trim()).map((d, di) => (
                    <div key={di} style={{ marginLeft: 12 }}>
                      - {d.trim()}
                    </div>
                  ))}
                </div>
              )
            ))}
          </>
        )}
        {education.some((e) => e.school || e.degree) && (
          <>
            <strong style={{ marginTop: 8 }}>Education</strong>
            {education.map((e, i) => (
              (e.school || e.degree) && (
                <div key={i}>
                  {e.degree}
                  {e.degree && e.school ? ' - ' : ''}
                  {e.school} {e.dates ? `(${e.dates})` : ''}
                </div>
              )
            ))}
          </>
        )}
        {skillList.length > 0 && (
          <>
            <strong style={{ marginTop: 8 }}>Skills</strong>
            <div>{skillList.join(', ')}</div>
          </>
        )}
      </div>
    </div>
  );
}
