import { useState, useRef } from 'react';
import nspell from 'nspell';
import mammoth from 'mammoth';
import { SPELLCHECK_LANGUAGES } from './spellcheckLanguages.js';

const dictionaryCache = new Map(); // code -> nspell instance
let languageToolLangs = null; // cached list from the API, fetched once

async function loadSpellChecker(code) {
    if (dictionaryCache.has(code)) return dictionaryCache.get(code);
    const base = `https://cdn.jsdelivr.net/npm/dictionary-${code}`;
    const [aff, dic] = await Promise.all([
        fetch(`${base}/index.aff`).then((r) => {
            if (!r.ok) throw new Error(`No dictionary found for "${code}".`);
            return r.text();
        }),
        fetch(`${base}/index.dic`).then((r) => {
            if (!r.ok) throw new Error(`No dictionary found for "${code}".`);
            return r.text();
        }),
    ]);
    const checker = nspell({ aff, dic });
    dictionaryCache.set(code, checker);
    return checker;
}

async function getLanguageToolLangs() {
    if (languageToolLangs) return languageToolLangs;
    const res = await fetch('https://api.languagetool.org/v2/languages');
    if (!res.ok) throw new Error('Could not reach the grammar-check service.');
    languageToolLangs = await res.json();
    return languageToolLangs;
}

// Finds the best LanguageTool longCode for a spellcheck language code (e.g.
// spellcheck 'de-AT' or 'de' -> LanguageTool 'de-AT' or the generic 'de').
function matchLanguageToolCode(langs, spellCode) {
    const prefix = spellCode.split('-')[0].toLowerCase();
    const exact = langs.find((l) => l.longCode.toLowerCase() === spellCode.toLowerCase());
    if (exact) return exact.longCode;
    const sameRegion = langs.find((l) => l.longCode.toLowerCase().startsWith(spellCode.toLowerCase()));
    if (sameRegion) return sameRegion.longCode;
    const generic = langs.find((l) => l.code.toLowerCase() === prefix);
    return generic ? generic.longCode : null;
}

function tokenize(text) {
    // Unicode-aware "word" match: letters/marks/apostrophes/hyphens inside a
    // word, which is enough for real spell-checking without a full NLP
    // tokenizer.
    return [...text.matchAll(/[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*/gu)].map((m) => ({
        word: m[0],
        index: m.index,
    }));
}

export default function ProofreaderTool() {
    const [text, setText] = useState('');
    const [lang, setLang] = useState('en');
    const [spellResults, setSpellResults] = useState(null);
    const [spellStatus, setSpellStatus] = useState('idle'); // idle | loading | done
    const [grammarResults, setGrammarResults] = useState(null);
    const [grammarStatus, setGrammarStatus] = useState('idle'); // idle | loading | done | unsupported
    const [error, setError] = useState('');
    const [fileStatus, setFileStatus] = useState('idle'); // idle | loading
    const [fileName, setFileName] = useState('');
    const textareaRef = useRef(null);

    async function handleFileUpload(e) {
        const file = e.target.files?.[0];
        e.target.value = ''; // allow re-uploading the same file name later
        if (!file) return;
        setError('');
        setFileStatus('loading');
        setFileName(file.name);
        try {
            const lowerName = file.name.toLowerCase();
            let extracted;
            if (lowerName.endsWith('.docx')) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                extracted = result.value;
            } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.md') || file.type.startsWith('text/')) {
                extracted = await file.text();
            } else if (lowerName.endsWith('.doc')) {
                throw new Error('Old-format .doc files aren\'t supported - please save as .docx or .txt and try again.');
            } else {
                throw new Error('Unsupported file type. Upload a .txt, .md, or .docx file.');
            }
            setText(extracted);
            setSpellResults(null);
            setGrammarResults(null);
            setGrammarStatus('idle');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Could not read that file.');
        } finally {
            setFileStatus('idle');
        }
    }

    async function handleCheckSpelling() {
        if (!text.trim()) return;
        setError('');
        setSpellStatus('loading');
        setSpellResults(null);
        try {
            const checker = await loadSpellChecker(lang);
            const words = tokenize(text);
            const seen = new Map();
            for (const { word } of words) {
                const key = word.toLowerCase();
                if (seen.has(key)) continue;
                if (/^\d+$/.test(word)) continue; // skip pure numbers
                if (!checker.correct(word)) {
                    seen.set(key, {
                        word,
                        suggestions: checker.suggest(word).slice(0, 5),
                    });
                }
            }
            setSpellResults(Array.from(seen.values()));
            setSpellStatus('done');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Could not load a spell-checking dictionary for that language.');
            setSpellStatus('idle');
        }
    }

    async function handleCheckGrammar() {
        if (!text.trim()) return;
        setError('');
        setGrammarStatus('loading');
        setGrammarResults(null);
        try {
            const langs = await getLanguageToolLangs();
            const ltCode = matchLanguageToolCode(langs, lang);
            if (!ltCode) {
                setGrammarStatus('unsupported');
                return;
            }
            const res = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ text, language: ltCode }),
            });
            if (!res.ok) throw new Error('The grammar-check service could not process this text.');
            const data = await res.json();
            setGrammarResults(data.matches || []);
            setGrammarStatus('done');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Could not reach the grammar-check service.');
            setGrammarStatus('idle');
        }
    }

    function applySuggestion(original, replacement) {
        setText((prev) => {
            const idx = prev.indexOf(original);
            if (idx === -1) return prev;
            return prev.slice(0, idx) + replacement + prev.slice(idx + original.length);
        });
    }

    const isBusy = spellStatus === 'loading' || grammarStatus === 'loading';

    return (
        <div className="tool-page">
            <h1>Proofreader (Spelling &amp; Grammar Checker)</h1>
            <p className="tool-description">
                Paste or type text and check it for spelling and grammar mistakes, in any of about 90
                languages. <strong>Spell-checking runs entirely in your browser</strong> - your text is
                never sent anywhere, only the dictionary file for the language you pick (a few hundred KB)
                is fetched from a public CDN. <strong>Grammar &amp; style checking is opt-in</strong> and,
                unlike every other tool on this site, sends your text to a third-party service
                (LanguageTool's public API) to get real grammar suggestions - only click that button if
                you're fine with that for this text.
            </p>
            <div className="tool-controls">
                <label>
                    Upload a document (.txt, .md, or .docx):
                    <input type="file" accept=".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={isBusy || fileStatus === 'loading'} />
                </label>
                <label>
                    Language:
                    <select value={lang} onChange={(e) => { setLang(e.target.value); setSpellResults(null); setGrammarResults(null); setGrammarStatus('idle'); }} disabled={isBusy}>
                        {SPELLCHECK_LANGUAGES.map((l) => (
                            <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            {fileStatus === 'loading' && <div style={{ fontSize: '0.9em', margin: '4px 0' }}>Reading {fileName}...</div>}
            {fileStatus === 'idle' && fileName && !error && (
                <div style={{ fontSize: '0.9em', margin: '4px 0', color: 'var(--muted, #888)' }}>Loaded text from {fileName}.</div>
            )}
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here..."
                rows={10}
                style={{
                    width: '100%',
                    fontFamily: 'inherit',
                    fontSize: '1em',
                    padding: 10,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    resize: 'vertical',
                    marginTop: 8,
                }}
            />
            <div className="tool-controls" style={{ marginTop: 8 }}>
                <button onClick={handleCheckSpelling} disabled={!text.trim() || isBusy}>
                    {spellStatus === 'loading' ? 'Checking spelling...' : 'Check spelling'}
                </button>
                <button onClick={handleCheckGrammar} disabled={!text.trim() || isBusy}>
                    {grammarStatus === 'loading' ? 'Checking grammar...' : 'Check grammar & style (sends text to LanguageTool)'}
                </button>
            </div>
            {error && <div className="tool-error">{error}</div>}

            {spellResults !== null && (
                <div className="tool-panel" style={{ marginTop: 16 }}>
                    <label>
                        Spelling {spellResults.length === 0 ? '- no issues found' : `- ${spellResults.length} possibly misspelled word${spellResults.length === 1 ? '' : 's'}`}
                    </label>
                    {spellResults.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
                            {spellResults.map((r) => (
                                <li key={r.word} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                    <strong style={{ color: '#c0392b' }}>{r.word}</strong>
                                    {r.suggestions.length > 0 ? (
                                        <span style={{ marginLeft: 8 }}>
                                            →{' '}
                                            {r.suggestions.map((s, i) => (
                                                <span key={s}>
                                                    <button
                                                        type="button"
                                                        onClick={() => applySuggestion(r.word, s)}
                                                        style={{ margin: '0 4px', padding: '2px 8px', fontSize: '0.9em' }}
                                                    >
                                                        {s}
                                                    </button>
                                                </span>
                                            ))}
                                        </span>
                                    ) : (
                                        <span style={{ marginLeft: 8, color: 'var(--muted, #888)' }}>(no suggestions)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {grammarStatus === 'unsupported' && (
                <div className="tool-error" style={{ marginTop: 16 }}>
                    LanguageTool doesn't support "{SPELLCHECK_LANGUAGES.find((l) => l.code === lang)?.name}" for grammar checking. Spell-checking above still works for this language.
                </div>
            )}

            {grammarResults !== null && (
                <div className="tool-panel" style={{ marginTop: 16 }}>
                    <label>
                        Grammar &amp; style {grammarResults.length === 0 ? '- no issues found' : `- ${grammarResults.length} issue${grammarResults.length === 1 ? '' : 's'}`}
                    </label>
                    {grammarResults.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
                            {grammarResults.map((m, i) => {
                                const original = text.slice(m.offset, m.offset + m.length);
                                return (
                                    <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: '0.95em' }}>{m.message}</div>
                                        <div style={{ margin: '4px 0', fontSize: '0.9em', color: 'var(--muted, #888)' }}>
                                            "...{text.slice(Math.max(0, m.offset - 20), m.offset)}
                                            <strong style={{ color: '#c0392b' }}>{original}</strong>
                                            {text.slice(m.offset + m.length, m.offset + m.length + 20)}..."
                                        </div>
                                        {m.replacements && m.replacements.length > 0 && (
                                            <div>
                                                →{' '}
                                                {m.replacements.slice(0, 5).map((r) => (
                                                    <button
                                                        key={r.value}
                                                        type="button"
                                                        onClick={() => applySuggestion(original, r.value)}
                                                        style={{ margin: '0 4px', padding: '2px 8px', fontSize: '0.9em' }}
                                                    >
                                                        {r.value}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
