import { AlertTriangle, LoaderCircle, RefreshCw, Sparkles, X } from 'lucide-react';
import Button from './Button.jsx';

export function LoadingState({ onCancel }) {
  return <section className="mx-auto max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-soft" aria-live="polite">
    <div className="subtle-grid border-b px-6 py-14 text-center"><div className="mx-auto grid size-12 place-items-center rounded-xl border bg-white shadow-sm"><LoaderCircle className="animate-spin text-zinc-700" size={21} /></div><p className="eyebrow mt-5">Working on it</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Building your study set</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">Structuring your material, writing useful questions, and validating every answer.</p></div>
    <div className="flex items-center justify-between px-5 py-4"><span className="flex items-center gap-2 text-xs text-zinc-400"><span className="size-1.5 animate-pulse rounded-full bg-indigo-500" />Generation in progress</span><Button variant="secondary" onClick={onCancel}><X size={15} />Cancel</Button></div>
  </section>;
}

export function ErrorState({ message, onRetry, onBack }) {
  return <section className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-soft sm:p-8" role="alert">
    <div className="grid size-10 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-600"><AlertTriangle size={19} /></div>
    <p className="eyebrow mt-6 text-red-600">Generation failed</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Something interrupted the flow.</h2><p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">{message}</p>
    <div className="mt-7 flex flex-wrap gap-2"><Button onClick={onRetry}><RefreshCw size={15} />Try again</Button><Button variant="secondary" onClick={onBack}>Edit source</Button></div>
  </section>;
}

export function EmptyState({ title, message, action }) {
  return <div className="subtle-grid rounded-2xl border bg-white px-6 py-16 text-center"><div className="mx-auto grid size-10 place-items-center rounded-lg border bg-white shadow-sm"><Sparkles className="text-zinc-500" size={17} /></div><h2 className="mt-5 text-lg font-semibold tracking-tight">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">{message}</p>{action && <div className="mt-6">{action}</div>}</div>;
}
