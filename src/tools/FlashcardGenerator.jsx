import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
export default function FlashcardGenerator() {
    const [topic, setTopic] = useState('');
    const [studyOrder, setStudyOrder] = useState(null);
    const [current, setCurrent] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const ai = useAiGenerate('flashcards', 'Flashcard Generator');
    const cards = ai.result?.cards || [];
    const validCards = cards.filter((c) => c.term && c.definition);
    const order = studyOrder || validCards.map((_, i) => i);
    async function handleGenerate() {
        setStudyOrder(null);
        await ai.generate({ topic });
    }
    function startStudy() {
        setStudyOrder(validCards.map((_, i) => i));
        setCurrent(0);
        setFlipped(false);
    }
    function handleShuffle() {
        setStudyOrder(shuffle(validCards.map((_, i) => i)));
        setCurrent(0);
        setFlipped(false);
    }
    function next() {
        setFlipped(false);
        setCurrent((c) => Math.min(c + 1, order.length - 1));
    }
    function prev() {
        setFlipped(false);
        setCurrent((c) => Math.max(c - 1, 0));
    }
    const activeCard = studyOrder && validCards.length > 0 ? validCards[order[current]] : null;
    return (
        <div className="tool-page">
            <h1>Flashcard Generator</h1>
            <p className="tool-description">
                Enter a topic and click "Generate with AI" for a genuinely AI-written flashcard deck, then
                study them as flippable cards - click a card to reveal its definition. Shuffle uses real
                cryptographic randomness, not a biased sort. Free, no account needed (rate-limited to keep
                it free for everyone).
            </p>
            {!studyOrder && (
                <>
                    <div className="tool-panel">
                        <label htmlFor="fc-topic">Topic</label>
                        <input id="fc-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Photosynthesis, French vocabulary, JavaScript basics" />
                    </div>
                    <div className="tool-controls">
                        <button type="button" onClick={handleGenerate} disabled={ai.loading || !topic.trim()}>
                            {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                        </button>
                        <button type="button" onClick={startStudy} disabled={validCards.length === 0}>
                            Study deck ({validCards.length} card{validCards.length === 1 ? '' : 's'})
                        </button>
                        <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                            {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                        </button>
                    </div>
                    {ai.showApiSetup && (
                        <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
                    )}
                    {ai.error && <div className="agent-error">{ai.error}</div>}
                    <ul className="uuid-list">
                        {cards.map((c, i) => (
                            <li key={i} style={{ gap: 8 }}>
                                <span style={{ flex: 1 }}>
                                    <strong>{c.term}</strong>
                                </span>
                                <span style={{ flex: 1 }}>{c.definition}</span>
                            </li>
                        ))}
                    </ul>
                    {!cards.length && !ai.loading && (
                        <p className="tool-placeholder">Enter a topic above and click Generate with AI to build a flashcard deck.</p>
                    )}
                </>
            )}
            {studyOrder && activeCard && (
                <>
                    <div className="tool-controls">
                        <button type="button" onClick={() => setStudyOrder(null)}>
                            Back to editing
                        </button>
                        <button type="button" onClick={handleShuffle}>
                            Shuffle
                        </button>
                        <span>
                            Card {current + 1} of {order.length}
                        </span>
                    </div>
                    <div className="timestamp-result" onClick={() => setFlipped((f) => !f)} style={{ cursor: 'pointer', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 18 }} >
                        {flipped ? activeCard.definition : activeCard.term}
                    </div>
                    <p className="tool-placeholder" style={{ textAlign: 'center' }}>
                        Click the card to {flipped ? 'show the term' : 'reveal the definition'}
                    </p>
                    <div className="tool-controls" style={{ justifyContent: 'center' }}>
                        <button type="button" onClick={prev} disabled={current === 0}>
                            Previous
                        </button>
                        <button type="button" onClick={next} disabled={current === order.length - 1}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
