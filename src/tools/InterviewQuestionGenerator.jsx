import { useState } from 'react';
const QUESTION_BANK = {
  'Software Engineer': [
    'Tell me about a challenging technical problem you solved recently.',
    'How do you approach debugging a production issue?',
    'Describe a time you had to refactor a poorly written codebase.',
    'How do you decide between different architectural approaches?',
    'Tell me about a time you disagreed with a teammate on a technical decision.',
    'How do you keep your skills up to date?',
    'Walk me through how you would design a URL shortening service.',
    'Describe your testing philosophy.'
  ],
  Sales: [
    'Tell me about a time you turned around a difficult client relationship.',
    'Walk me through how you qualify a lead.',
    'Describe your process for handling objections.',
    'Tell me about your biggest sale and how you closed it.',
    'How do you stay motivated after a string of rejections?',
    'How do you research a prospect before reaching out?',
    'Describe a time you missed a quota. What did you learn?'
  ],
  Marketing: [
    'Tell me about a campaign you ran that didn\'t go as planned.',
    'How do you measure the success of a marketing campaign?',
    'Describe how you would position a new product against competitors.',
    'Tell me about a time you used data to change a marketing strategy.',
    'How do you balance brand consistency with experimentation?',
    'Describe your experience working with cross-functional teams.'
  ],
  'Customer Service': [
    'Tell me about a time you dealt with an angry customer.',
    'How do you prioritize multiple customer requests at once?',
    'Describe a time you went above and beyond for a customer.',
    'How do you handle a situation where you don\'t know the answer?',
    'Tell me about a time you had to deliver bad news to a customer.',
    'How do you measure customer satisfaction in your role?'
  ],
  Management: [
    'Tell me about a time you had to manage an underperforming employee.',
    'How do you delegate work across your team?',
    'Describe your approach to giving constructive feedback.',
    'Tell me about a difficult decision you had to make as a leader.',
    'How do you handle conflict between team members?',
    'Describe how you set goals for your team.',
    'Tell me about a time you had to manage change within your team.'
  ]
};
const GENERAL_QUESTIONS = [
  'Tell me about yourself.',
  'Why do you want to work here?',
  'What are your greatest strengths and weaknesses?',
  'Where do you see yourself in five years?',
  'Why are you leaving your current role?',
  'Do you have any questions for us?'
];
export default function InterviewQuestionGenerator() {
  const [role, setRole] = useState('Software Engineer');
  const [includeGeneral, setIncludeGeneral] = useState(true);
  const roleQuestions = QUESTION_BANK[role] || [];
  return (
    <div className="tool-page">
      <h1>Interview Question Generator</h1>
      <p className="tool-description">
        Pick a job category to see a curated list of common interview questions for that role,
        pulled from a built-in question bank. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {Object.keys(QUESTION_BANK).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={includeGeneral} onChange={(e) => setIncludeGeneral(e.target.checked)} />
          Include general questions
        </label>
      </div>
      <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>{role} questions</h2>
      <ul className="uuid-list">
        {roleQuestions.map((q, i) => (
          <li key={i}>
            <span>{q}</span>
          </li>
        ))}
      </ul>
      {includeGeneral && (
        <>
          <h2 style={{ fontSize: 16, margin: '16px 0 8px' }}>General questions</h2>
          <ul className="uuid-list">
            {GENERAL_QUESTIONS.map((q, i) => (
              <li key={i}>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
