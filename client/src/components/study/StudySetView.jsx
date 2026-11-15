import { useState } from 'react';
import { ArrowLeft, FileQuestion, Layers3, Plus } from 'lucide-react';
import Button from '../common/Button.jsx';
import FlashcardViewer from '../flashcards/FlashcardViewer.jsx';
import QuizPlayer from '../quiz/QuizPlayer.jsx';

export default function StudySetView({ session, onBack, onNew }) {
  const available = session.flashcards.length ? 'flashcards' : 'quiz';
  const [tab, setTab] = useState(available);
  return <main>
    <div className="mb-8 border-b pb-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><button onClick={onBack} className="inline-flex min-h-9 items-center gap-2 rounded-lg border bg-white px-3 text-xs font-semibold text-zinc-600 shadow-sm hover:text-zinc-950"><ArrowLeft size={14} />Library</button><Button variant="secondary" onClick={onNew}><Plus size={15} />New set</Button></div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_280px] lg:items-end"><div><p className="eyebrow">Study workspace</p><h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-[-0.035em] text-zinc-950 sm:text-5xl">{session.title}</h1></div><p className="border-l-2 border-zinc-950 pl-4 text-sm leading-6 text-zinc-500">{session.description}</p></div>
    </div>
    {session.flashcards.length > 0 && session.quiz.length > 0 && <div className="mb-7 inline-flex rounded-lg border bg-zinc-100 p-1"><button onClick={() => setTab('flashcards')} className={`flex min-h-9 items-center gap-2 rounded-md px-4 text-xs font-semibold transition ${tab === 'flashcards' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}><Layers3 size={15} />Cards <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px]">{session.flashcards.length}</span></button><button onClick={() => setTab('quiz')} className={`flex min-h-9 items-center gap-2 rounded-md px-4 text-xs font-semibold transition ${tab === 'quiz' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}><FileQuestion size={15} />Quiz <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px]">{session.quiz.length}</span></button></div>}
    <div className="mx-auto max-w-3xl">{tab === 'flashcards' ? <FlashcardViewer cards={session.flashcards} /> : <QuizPlayer key={session.id} questions={session.quiz} difficulty={session.difficulty} onBack={() => setTab(session.flashcards.length ? 'flashcards' : 'quiz')} />}</div>
  </main>;
}
