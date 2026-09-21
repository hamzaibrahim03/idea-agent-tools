import { useState } from 'react';
function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
export default function FlashcardGenerator() {
  const [cards, setCards] = useState([
    { term: '', definition: '' }
  ]);
  const [studyOrder, setStudyOrder] = useState(null);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  function updateCard(i, field, value) {
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }
  const validCards = cards.filter((c) => c.term.trim() && c.definition.trim());
  const order = studyOrder || validCards.map((_, i) => i);
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
        Add term/definition pairs to build a flashcard deck, then study them as flippable cards -
        click a card to reveal its definition. Shuffle uses real cryptographic randomness, not a
        biased sort. Runs entirely in your browser.
      </p>
      {!studyOrder && (
        <>
          <div className="tool-controls">
            <button type="button" onClick={() => setCards((prev) => [...prev, { term: '', definition: '' }])}>
              Add card
            </button>
            <button type="button" onClick={startStudy} disabled={validCards.length === 0}>
              Study deck ({validCards.length} card{validCards.length === 1 ? '' : 's'})
            </button>
          </div>
          <ul className="uuid-list">
            {cards.map((c, i) => (
              <li key={i} style={{ gap: 8 }}>
                <input type="text" placeholder="Term" value={c.term} onChange={(e) => updateCard(i, 'term', e.target.value)} style={{ flex: 1 }} />
                <input
                  type="text"
                  placeholder="Definition"
                  value={c.definition}
                  onChange={(e) => updateCard(i, 'definition', e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="uuid-copy-btn"
                  onClick={() => setCards((prev) => prev.filter((_, idx) => idx !== i))}
                  disabled={cards.length <= 1}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
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
          <div
            className="timestamp-result"
            onClick={() => setFlipped((f) => !f)}
            style={{ cursor: 'pointer', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 18 }}
          >
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
