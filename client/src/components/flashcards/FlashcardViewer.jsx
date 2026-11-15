import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, ThumbsDown } from 'lucide-react';
import Button from '../common/Button.jsx';
import { EmptyState } from '../common/StatusStates.jsx';

export default function FlashcardViewer({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [statuses, setStatuses] = useState({});
  const [reviewOnly, setReviewOnly] = useState(false);
  const visibleCards = useMemo(() => reviewOnly ? cards.filter((card) => statuses[card.id] === 'review') : cards, [cards, statuses, reviewOnly]);
  const current = visibleCards[index];
  const understood = cards.filter((card) => statuses[card.id] === 'got-it').length;
  const review = cards.filter((card) => statuses[card.id] === 'review').length;
  const remaining = cards.length - Object.keys(statuses).filter((id) => cards.some((card) => card.id === id)).length;

  useEffect(() => { setIndex(0); setFlipped(false); }, [reviewOnly, cards]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (event.key === 'ArrowLeft') { setIndex((value) => Math.max(0, value - 1)); setFlipped(false); }
      if (event.key === 'ArrowRight') { setIndex((value) => Math.min(visibleCards.length - 1, value + 1)); setFlipped(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visibleCards.length]);

  if (!cards.length) return <EmptyState title="No flashcards in this set" message="This set was generated as a quiz." />;
  if (reviewOnly && !visibleCards.length) return <EmptyState title="All clear" message="No cards are marked for review." action={<Button variant="secondary" onClick={() => setReviewOnly(false)}>Back to all cards</Button>} />;

  const mark = (status) => { setStatuses((value) => ({ ...value, [current.id]: status })); if (index < visibleCards.length - 1) { setIndex(index + 1); setFlipped(false); } };
  const move = (next) => { setIndex(next); setFlipped(false); };
  return <section aria-label="Flashcard study mode">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center divide-x rounded-lg border bg-white text-xs shadow-sm"><Stat label="Known" value={understood} /><Stat label="Review" value={review} /><Stat label="Left" value={remaining} /></div><button onClick={() => setReviewOnly(!reviewOnly)} className="rounded-lg px-3 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950">{reviewOnly ? 'Show every card' : `Review difficult · ${review}`}</button></div>
    <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-zinc-400"><span>CARD {String(index + 1).padStart(2, '0')}</span><span>{visibleCards.length} TOTAL</span></div>
    <div className="mb-5 h-1 overflow-hidden rounded-full bg-zinc-200"><div className="h-full rounded-full bg-zinc-950 transition-all" style={{ width: `${((index + 1) / visibleCards.length) * 100}%` }} /></div>
    <div className="flip-scene h-[340px] sm:h-[390px]"><button aria-label={flipped ? 'Showing answer. Press to see question.' : 'Showing question. Press to reveal answer.'} onClick={() => setFlipped(!flipped)} className={`flip-card relative size-full text-left ${flipped ? 'is-flipped' : ''}`}><div className="flip-face absolute inset-0 flex flex-col justify-between rounded-2xl border bg-white p-7 shadow-soft sm:p-10"><div className="flex items-center justify-between"><span className="eyebrow">Prompt</span><span className="font-mono text-[10px] text-zinc-300">CLICK TO FLIP</span></div><p className="max-w-2xl text-2xl font-semibold leading-snug tracking-[-0.025em] sm:text-3xl">{current.question}</p><span className="text-xs text-zinc-400">Enter or space also works</span></div><div className="flip-face flip-back absolute inset-0 flex flex-col justify-between rounded-2xl border border-zinc-950 bg-zinc-950 p-7 text-white shadow-soft sm:p-10"><div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Answer</span><span className="font-mono text-[10px] text-zinc-600">CLICK TO RETURN</span></div><p className="max-w-2xl text-xl font-medium leading-relaxed tracking-[-0.015em] sm:text-2xl">{current.answer}</p><span className="text-xs text-zinc-500">How well did you know this?</span></div></button></div>
    {flipped && <div className="mt-4 grid grid-cols-2 gap-2" aria-label="Rate your understanding"><Button variant="secondary" onClick={() => mark('review')}><ThumbsDown size={15} />Need review</Button><Button onClick={() => mark('got-it')}><Check size={15} />Got it</Button></div>}
    <div className="mt-5 flex items-center justify-between"><Button variant="secondary" disabled={index === 0} onClick={() => move(index - 1)}><ArrowLeft size={15} /><span className="hidden sm:inline">Previous</span></Button><button onClick={() => setFlipped(!flipped)} className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-950"><RotateCcw size={14} />Flip</button><Button variant="secondary" disabled={index === visibleCards.length - 1} onClick={() => move(index + 1)}><span className="hidden sm:inline">Next</span><ArrowRight size={15} /></Button></div>
  </section>;
}

function Stat({ label, value }) { return <div className="flex items-center gap-2 px-3 py-2"><strong className="text-zinc-950">{value}</strong><span className="text-zinc-400">{label}</span></div>; }
