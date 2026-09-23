import { useState } from 'react';
import { callAnthropicDirect, callGeminiDirect, callServerFunction } from '../lib/aiClient.js';
const CATEGORIES = {
  video: {
    match: /\b(video|shoot|scene|footage|film|clip)\b/i,
    role: 'an experienced video director and cinematographer',
    keyElements: [
      'Setting: where and when the scene takes place',
      'Subject: who or what the camera should focus on',
      'Camera work: shot types (wide, medium, close-up), angles, and movement',
      'Lighting and mood: time of day, weather, and the emotional tone',
      'Sound design: ambient noise, music, or dialogue that supports the visuals'
    ],
    format: 'A sequential, scene-by-scene description (camera angle, subject, action, and effect for each shot), suitable for a video generation AI.',
    exampleLabel: 'Example scene breakdown',
    example: [
      'Scene 1 - Camera: wide establishing shot. Subject: the overall setting. Effect: sets the mood and location.',
      'Scene 2 - Camera: medium shot, slow push-in. Subject: the main focus of the video. Effect: draws attention to the key detail.',
      'Scene 3 - Camera: close-up. Subject: a small, evocative detail. Effect: reinforces the atmosphere.'
    ],
    notes: 'State the target length (e.g. 15-30 seconds). Mention whether the tone should be calm, dramatic, or something else.'
  },
  email: {
    match: /\b(write|draft|compose)\b.*\b(email|message)\b|\bfollow-?up email\b/i,
    role: 'a skilled professional writer',
    keyElements: [
      'Recipient and relationship: who this is to, and the context between you',
      'Purpose: the one thing this email needs to accomplish',
      'Key points: the specific facts, asks, or details that must be included',
      'Tone: formal, friendly, apologetic, persuasive, etc.',
      'Call to action: what you want the recipient to do next'
    ],
    format: 'A ready-to-send email with a subject line, greeting, body, and sign-off.',
    exampleLabel: 'Example structure',
    example: [
      'Subject: a short, specific line that states the purpose',
      'Greeting: appropriate to the relationship (formal or casual)',
      'Opening line: states why you\'re writing',
      'Body: the key points, in priority order',
      'Closing: the call to action, then a sign-off'
    ],
    notes: 'Mention your relationship to the recipient and any deadline, so the tone and urgency come out right.'
  },
  code: {
    match: /\b(code|function|script|program|debug|refactor|api|algorithm)\b/i,
    role: 'an expert software engineer',
    keyElements: [
      'Language and environment: the programming language, framework, and runtime',
      'Current behavior vs. desired behavior: what happens now, and what should happen instead',
      'Constraints: performance, compatibility, or style requirements',
      'Edge cases: inputs or conditions the solution must handle correctly',
      'Testing: how the result should be verified'
    ],
    format: 'Working code with brief inline comments explaining non-obvious decisions, followed by a short explanation of the approach.',
    exampleLabel: 'Example structure',
    example: [
      'A short explanation of the approach before the code',
      'The code itself, formatted and ready to run',
      'A note on any edge cases or trade-offs the solution makes'
    ],
    notes: 'Paste the actual code or error message if you have one - specifics produce far better results than a description alone.'
  },
  blog: {
    match: /\b(blog|article|post)\b/i,
    role: 'an experienced content writer',
    keyElements: [
      'Audience: who this is written for, and what they already know',
      'Main takeaway: the single idea a reader should leave with',
      'Structure: the sections or subtopics to cover',
      'Length: an approximate word count',
      'SEO/keywords: any terms that should appear naturally, if relevant'
    ],
    format: 'A well-structured article with a title, headings, and short paragraphs.',
    exampleLabel: 'Example structure',
    example: [
      'Title: clear and specific',
      'Introduction: hooks the reader and states what the article covers',
      '2-4 headed sections: each covering one subtopic',
      'Conclusion: summarizes the takeaway'
    ],
    notes: 'Mention the target audience\'s existing knowledge level so the article pitches at the right depth.'
  },
  image: {
    match: /\b(image|photo|picture|illustration|logo|design|artwork)\b/i,
    role: 'a skilled visual artist and art director',
    keyElements: [
      'Subject: the main focal point of the image',
      'Style: photorealistic, illustration, painting, 3D render, etc.',
      'Composition: framing, angle, and focal point',
      'Lighting and color: mood, light source, and palette',
      'Details: textures, background elements, and any text to include'
    ],
    format: 'A single, detailed visual description covering subject, style, composition, lighting, and color, written for an image generation AI.',
    exampleLabel: 'Example structure',
    example: [
      'Subject and action: what is shown, and what it\'s doing',
      'Style and medium: the visual technique to use',
      'Lighting and atmosphere: the mood the image should evoke',
      'Composition: how it should be framed'
    ],
    notes: 'Reference a specific artist, film, or visual style if you have one in mind - it sharpens the result considerably.'
  },
  plan: {
    match: /\b(plan|strategy|roadmap)\b/i,
    role: 'a strategic planner',
    keyElements: [
      'Goal: the specific outcome this plan should achieve',
      'Timeframe: how long the plan should cover',
      'Resources and constraints: budget, team size, or other limits',
      'Milestones: key checkpoints along the way',
      'Risks: anything that could derail the plan'
    ],
    format: 'A numbered, step-by-step plan with milestones and a rough timeline for each step.',
    exampleLabel: 'Example structure',
    example: [
      'Step 1: the first concrete action, with a target date',
      'Step 2-N: each subsequent action, building on the last',
      'Milestone check-ins: points to review progress'
    ],
    notes: 'State any hard deadlines or resource limits up front - they shape which steps are realistic.'
  },
  summary: {
    match: /\b(summarize|summarise|tl;?dr)\b/i,
    role: 'an expert summarizer',
    keyElements: [
      'Source material: what is being summarized',
      'Length: how short the summary should be',
      'Focus: which aspects matter most (findings, decisions, action items, etc.)',
      'Audience: how much background the reader already has'
    ],
    format: 'A concise bullet-point summary, ordered by importance.',
    exampleLabel: 'Example structure',
    example: [
      'A one-line overview of the main point',
      '3-5 bullet points covering the key details',
      '(If relevant) A short "action items" list'
    ],
    notes: 'Paste the actual source text if possible - a summarizer works far better with the real material than a description of it.'
  }
};
function detectCategory(description) {
  for (const category of Object.values(CATEGORIES)) {
    if (category.match.test(description)) return category;
  }
  return null;
}
const API_KEY_STORAGE_KEY = 'idea-agent:prompt-generator:api-key';
const API_PROVIDER_STORAGE_KEY = 'idea-agent:prompt-generator:api-provider';
const PROVIDERS = {
  anthropic: { label: 'Anthropic (Claude)', keyPlaceholder: 'sk-ant-...' },
  gemini: { label: 'Google (Gemini)', keyPlaceholder: 'AIza...' }
};
const META_PROMPT = (description) =>
  `You are an expert prompt engineer. Turn the following short request into a single, ` +
  `well-structured, detailed prompt that the requester can paste directly into an AI chatbot ` +
  `to get a high-quality result. Write the improved prompt itself - do not explain what you did, ` +
  `do not wrap it in quotes or code fences, and do not add any preamble like "Here is your prompt". ` +
  `Just output the finished prompt text, ready to use.\n\nRequest: ${description}`;
function buildSection(heading, body) {
  return `# ${heading}\n\n${body}`;
}
function buildBulletList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}
export function buildPrompt(fields) {
  const description = fields.description.trim();
  if (!description) return '';
  const role = fields.role.trim();
  const format = fields.format.trim();
  const tone = fields.tone.trim();
  const constraints = fields.constraints.trim();
  const examples = fields.examples.trim();
  const category = detectCategory(description);
  const effectiveRole = role || (category ? category.role : '');
  const effectiveFormat = format || (category ? category.format : '');
  const sections = [];
  sections.push(
    (effectiveRole ? `You are ${effectiveRole}. ` : '') + description
  );
  if (category) {
    sections.push(
      buildSection(
        'Key Elements to Consider',
        buildBulletList(category.keyElements)
      )
    );
  }
  const formatLines = [];
  if (effectiveFormat) formatLines.push(effectiveFormat);
  if (tone) formatLines.push(`Use a ${tone.toLowerCase()} tone.`);
  if (formatLines.length) {
    sections.push(buildSection('Output Format', formatLines.join(' ')));
  }
  if (examples) {
    sections.push(buildSection('Example(s) You Provided', examples));
  } else if (category) {
    sections.push(
      buildSection(category.exampleLabel, buildBulletList(category.example))
    );
  }
  const noteLines = [];
  if (constraints) noteLines.push(constraints);
  if (category) noteLines.push(category.notes);
  if (noteLines.length) {
    sections.push(buildSection('Notes', buildBulletList(noteLines)));
  }
  return sections.join('\n\n');
}
const initialFields = {
  description: '',
  role: '',
  format: '',
  tone: '',
  constraints: '',
  examples: ''
};
export default function PromptGenerator() {
  const [fields, setFields] = useState(initialFields);
  const [showRefine, setShowRefine] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState(() => {
    try {
      return localStorage.getItem(API_PROVIDER_STORAGE_KEY) || 'anthropic';
    } catch {
      return 'anthropic';
    }
  });
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  function updateField(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
    if (key === 'description') {
      setAiOutput('');
      setAiError('');
    }
  }
  function updateProvider(value) {
    setProvider(value);
    try {
      localStorage.setItem(API_PROVIDER_STORAGE_KEY, value);
    } catch {
    }
  }
  function updateApiKey(value) {
    setApiKey(value);
    try {
      if (value) localStorage.setItem(API_KEY_STORAGE_KEY, value);
      else localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch {
    }
  }
  const templateOutput = buildPrompt(fields);
  const output = aiOutput || templateOutput;
  async function handleGenerateWithAi() {
    const description = fields.description.trim();
    if (!description) return;
    setAiLoading(true);
    setAiError('');
    setAiOutput('');
    try {
      const trimmedKey = apiKey.trim();
      const result = trimmedKey
        ? provider === 'anthropic'
          ? await callAnthropicDirect(trimmedKey, META_PROMPT(description))
          : await callGeminiDirect(trimmedKey, META_PROMPT(description))
        : (await callServerFunction('/api/generate-prompt', { provider, description }))?.result;
      if (!result) throw new Error('The model returned an empty response. Try again.');
      setAiOutput(result);
    } catch (e) {
      setAiError(e.message || 'Something went wrong calling the API.');
    } finally {
      setAiLoading(false);
    }
  }
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleClear() {
    setFields(initialFields);
    setAiOutput('');
    setAiError('');
  }
  return (
    <div className="tool-page">
      <h1>AI Prompt Generator</h1>
      <p className="tool-description">
        Describe what you want and click "Generate with AI" for a genuinely AI-written prompt -
        free, no account needed (rate-limited to keep it free for everyone). For unlimited use,
        connect your own Anthropic/Gemini API key below instead, which talks directly from your
        browser to the provider and is never sent to us. A quick offline template is also always
        available with no AI call at all.
      </p>
      <div className="tool-panel">
        <label htmlFor="prompt-description">What do you want the AI to do?</label>
        <textarea
          id="prompt-description"
          value={fields.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="e.g. Create a village video with rain, or Write a follow-up email after a job interview"
          style={{ minHeight: 110 }}
        />
      </div>
      <div className="tool-controls">
        <button
          onClick={handleGenerateWithAi}
          disabled={!fields.description.trim() || aiLoading}
        >
          {aiLoading ? 'Generating…' : 'Generate with AI'}
        </button>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy prompt'}
        </button>
        <button onClick={handleClear}>Clear all</button>
        <button type="button" onClick={() => setShowRefine((v) => !v)}>
          {showRefine ? 'Hide refine options' : 'Refine further (optional)'}
        </button>
        <button type="button" onClick={() => setShowApiSetup((v) => !v)}>
          {showApiSetup ? 'Hide own-key setup' : apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
        </button>
      </div>
      {showApiSetup && (
        <div className="tool-panel" style={{ maxWidth: 480 }}>
          <p className="tool-description" style={{ marginTop: 0, fontSize: 13 }}>
            "Generate with AI" already works for free with no setup, rate-limited to keep it
            free for everyone. Connect your own key here instead for unlimited use.
          </p>
          <label htmlFor="prompt-provider">AI provider</label>
          <select id="prompt-provider" value={provider} onChange={(e) => updateProvider(e.target.value)}>
            {Object.entries(PROVIDERS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </select>
          <label htmlFor="prompt-api-key" style={{ marginTop: 10 }}>
            API key
          </label>
          <input
            id="prompt-api-key"
            type="password"
            value={apiKey}
            onChange={(e) => updateApiKey(e.target.value)}
            placeholder={PROVIDERS[provider].keyPlaceholder}
            autoComplete="off"
          />
          <p className="tool-description" style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>
            Stored only in this browser's local storage - never sent to us. It is sent directly
            from your browser to {PROVIDERS[provider].label} when you click "Generate with AI",
            the same as pasting it into their own playground. Anyone with access to this device
            or browser could see it, so use a key you're comfortable with here, ideally one with
            a spending limit. Clear the field to remove it.
          </p>
        </div>
      )}
      {aiError && (
        <div className="tool-error">
          <strong>AI generation failed:</strong> {aiError}
        </div>
      )}
      {aiOutput && !aiError && (
        <p className="tool-description" style={{ marginTop: -4 }}>
          Below is the AI-generated prompt from {PROVIDERS[provider].label}.
        </p>
      )}
      {showRefine && (
        <div className="tool-grid">
          <div>
            <div className="tool-panel">
              <label htmlFor="prompt-role">Role (optional)</label>
              <input
                id="prompt-role"
                type="text"
                value={fields.role}
                onChange={(e) => updateField('role', e.target.value)}
                placeholder="Leave blank to auto-detect from your description"
              />
            </div>
            <div className="tool-panel">
              <label htmlFor="prompt-format">Output format (optional)</label>
              <input
                id="prompt-format"
                type="text"
                value={fields.format}
                onChange={(e) => updateField('format', e.target.value)}
                placeholder="Leave blank to auto-detect from your description"
              />
            </div>
            <div className="tool-panel">
              <label htmlFor="prompt-tone">Tone (optional)</label>
              <input
                id="prompt-tone"
                type="text"
                value={fields.tone}
                onChange={(e) => updateField('tone', e.target.value)}
                placeholder="Friendly and concise"
              />
            </div>
          </div>
          <div>
            <div className="tool-panel">
              <label htmlFor="prompt-constraints">Constraints (optional)</label>
              <textarea
                id="prompt-constraints"
                value={fields.constraints}
                onChange={(e) => updateField('constraints', e.target.value)}
                placeholder="Keep it under 200 words. Don't use jargon."
                style={{ minHeight: 90 }}
              />
            </div>
            <div className="tool-panel">
              <label htmlFor="prompt-examples">Example(s) (optional)</label>
              <textarea
                id="prompt-examples"
                value={fields.examples}
                onChange={(e) => updateField('examples', e.target.value)}
                placeholder="Input: ...\nOutput: ..."
                style={{ minHeight: 90 }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="tool-panel">
        <label htmlFor="prompt-output">Generated prompt</label>
        <textarea
          id="prompt-output"
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Describe what you want above to generate a prompt"
          style={{ minHeight: 260 }}
        />
      </div>
    </div>
  );
}
