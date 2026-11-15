import { Asterisk, Home, Library } from 'lucide-react';

export default function Navbar({ page, onNavigate }) {
  return <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
      <button onClick={() => onNavigate('home')} className="flex items-center gap-2 rounded-md font-bold tracking-[-0.02em]" aria-label="RecallAI home">
        <span className="grid size-7 place-items-center rounded-md bg-zinc-50 text-zinc-950"><Asterisk size={16} strokeWidth={2.4} /></span>
        <span className="text-zinc-100">Recall<span className="text-zinc-600">/</span>AI</span>
      </button>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-xs font-medium text-zinc-500 sm:flex"><span className="size-1.5 rounded-full bg-emerald-500" />AI workspace</div>
        <nav className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5" aria-label="Main navigation">
          <button onClick={() => onNavigate('home')} aria-current={page === 'home' ? 'page' : undefined} className={`flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition ${page === 'home' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-100'}`}><Home size={14} /><span className="hidden sm:inline">Create</span></button>
          <button onClick={() => onNavigate('saved')} aria-current={page === 'saved' ? 'page' : undefined} className={`flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition ${page === 'saved' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-100'}`}><Library size={14} /><span className="hidden sm:inline">Library</span></button>
        </nav>
      </div>
    </div>
  </header>;
}
