import { ArrowUpRight, BookOpenCheck, FileQuestion, Layers3, Sparkles, WandSparkles } from 'lucide-react';
import Button from '../common/Button.jsx';

const examples = {
  'Operating systems': 'Explain the fundamentals of operating systems, including processes, threads, deadlocks, scheduling algorithms, and memory management.',
  'Database systems': 'Explain database normalization, relational keys, SQL joins, transactions, and indexing with examples.',
  'Computer networks': 'Explain networking layers, TCP and UDP, IP addressing, routing, DNS, and HTTP fundamentals.',
  'Modern JavaScript': 'Teach JavaScript variables, scope, functions, arrays, objects, promises, and the event loop.'
};

const modes = [
  { id: 'flashcards', label: 'Flashcards', icon: Layers3 },
  { id: 'quiz', label: 'Quiz', icon: FileQuestion },
  { id: 'both', label: 'Cards + quiz', icon: BookOpenCheck }
];

export default function StudyGenerator({ form, setForm, onSubmit }) {
  const trimmed = form.input.trim();
  const error = trimmed.length > 0 && trimmed.length < 20 ? 'Add a little more detail — at least 20 characters.' : '';
  return <main>
    <section className="grid gap-8 pb-10 pt-8 lg:grid-cols-[1fr_340px] lg:items-end lg:pb-12 lg:pt-14">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-zinc-600 shadow-sm"><WandSparkles size={13} className="text-primary" />AI study workspace</div>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-zinc-950 sm:text-6xl">Turn messy notes into<br className="hidden sm:block" /> something that sticks.</h1>
      </div>
      <div className="border-l-2 border-zinc-950 pl-5">
        <p className="text-sm leading-6 text-zinc-600">Generate a focused study set in seconds. No chat threads, no prompt engineering—just material you can use.</p>
        <div className="mt-4 flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400"><span>Flashcards</span><span>Quizzes</span><span>Review</span></div>
      </div>
    </section>

    <form onSubmit={(event) => { event.preventDefault(); if (trimmed.length >= 20) onSubmit(); }} className="overflow-hidden rounded-2xl border bg-white shadow-soft">
      <div className="grid lg:grid-cols-[1fr_320px]">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div><p className="eyebrow">01 / Source</p><label htmlFor="study-input" className="mt-1 block text-base font-semibold tracking-tight">What are you studying?</label></div>
            <span className={`font-mono text-[11px] ${form.input.length > 12000 ? 'text-red-600' : 'text-zinc-400'}`}>{form.input.length.toLocaleString()} / 12K</span>
          </div>
          <textarea id="study-input" rows="12" maxLength="12000" value={form.input} onChange={(e) => setForm({ ...form, input: e.target.value })} aria-describedby="input-hint" placeholder={'Paste notes, a lecture transcript, or simply describe a topic…\n\nTry: Explain database normalization, SQL joins, and indexing with practical examples.'} className="mt-5 w-full resize-y rounded-xl border-0 bg-zinc-50 p-5 text-[15px] leading-7 text-zinc-900 ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-zinc-950" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p id="input-hint" className={`text-xs ${error ? 'text-red-600' : 'text-zinc-500'}`}>{error || 'Specific input creates better questions.'}</p><span className="text-[11px] text-zinc-400">Max 12,000 characters</span></div>
        </div>

        <aside className="border-t bg-zinc-50/70 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <p className="eyebrow">02 / Configure</p>
          <fieldset className="mt-5"><legend className="control-label">Format</legend><div className="mt-2 grid gap-1.5">{modes.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => setForm({ ...form, mode: id })} className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 text-left text-sm font-medium transition ${form.mode === id ? 'border-zinc-950 bg-zinc-950 text-white' : 'bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950'}`}><Icon size={15} /><span>{label}</span>{form.mode === id && <span className="ml-auto size-1.5 rounded-full bg-indigo-400" />}</button>)}</div></fieldset>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div><label htmlFor="difficulty" className="control-label">Level</label><select id="difficulty" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="mt-2 min-h-10 w-full rounded-lg border bg-white px-3 text-sm font-medium text-zinc-700"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
            <div><label htmlFor="count" className="control-label">Quantity</label><select id="count" value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} className="mt-2 min-h-10 w-full rounded-lg border bg-white px-3 text-sm font-medium text-zinc-700"><option value="5">5 each</option><option value="10">10 each</option><option value="15">15 each</option></select></div>
          </div>
          <Button type="submit" disabled={trimmed.length < 20} className="mt-6 w-full"><Sparkles size={16} />Build study set<ArrowUpRight size={16} className="ml-auto" /></Button>
          <p className="mt-3 text-center text-[11px] leading-5 text-zinc-400">Generated content is saved to this browser.</p>
        </aside>
      </div>
    </form>

    <section className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"><p className="shrink-0 text-xs font-semibold text-zinc-500">Quick starts</p><div className="flex flex-wrap gap-2">{Object.entries(examples).map(([label, value]) => <button key={label} onClick={() => setForm({ ...form, input: value })} className="group inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-medium text-zinc-600 shadow-sm transition hover:border-zinc-400 hover:text-zinc-950">{label}<ArrowUpRight size={12} className="text-zinc-300 transition group-hover:text-zinc-700" /></button>)}</div></section>
  </main>;
}
