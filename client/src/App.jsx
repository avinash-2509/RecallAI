import { useState } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import StudyGenerator from './components/generator/StudyGenerator.jsx';
import StudySetView from './components/study/StudySetView.jsx';
import SavedStudySets from './components/study/SavedStudySets.jsx';
import { ErrorState, LoadingState } from './components/common/StatusStates.jsx';
import { useStudyGenerator } from './hooks/useStudyGenerator.js';
import { loadSessions, writeSessions } from './utils/storage.js';

const initialForm = { input: '', mode: 'both', difficulty: 'beginner', count: 5 };

export default function App() {
  const [page, setPage] = useState('home');
  const [form, setForm] = useState(initialForm);
  const [sessions, setSessions] = useState(() => loadSessions());
  const [active, setActive] = useState(null);
  const [storageNotice, setStorageNotice] = useState('');
  const generator = useStudyGenerator((data, request) => {
    const session = { ...data, id: globalThis.crypto?.randomUUID?.() || `study-${Date.now()}`, createdAt: new Date().toISOString(), difficulty: request.difficulty, mode: request.mode };
    const next = [session, ...sessions.filter((item) => item.id !== session.id)];
    setSessions(next);
    const result = writeSessions(next);
    setStorageNotice(result.ok ? '' : result.message);
    setActive(session);
    setPage('study');
  });

  const navigate = (next) => { if (generator.status === 'loading') generator.cancel(); setPage(next); if (next !== 'study') setActive(null); };
  const deleteSession = (id) => { const next = sessions.filter((session) => session.id !== id); setSessions(next); const result = writeSessions(next); setStorageNotice(result.ok ? '' : result.message); };
  const startNew = () => { setForm(initialForm); setActive(null); generator.reset(); setPage('home'); };

  let content;
  if (page === 'saved') content = <SavedStudySets sessions={sessions} onOpen={(session) => { setActive(session); setPage('study'); }} onDelete={deleteSession} onCreate={() => setPage('home')} />;
  else if (page === 'study' && active) content = <StudySetView key={active.id} session={active} onBack={() => setPage('saved')} onNew={startNew} />;
  else if (generator.status === 'loading') content = <LoadingState onCancel={generator.cancel} />;
  else if (generator.status === 'error') content = <ErrorState message={generator.error.message} onRetry={generator.retry} onBack={generator.reset} />;
  else content = <StudyGenerator form={form} setForm={setForm} onSubmit={() => generator.generate(form)} />;

  return <div className="min-h-screen bg-zinc-950 text-zinc-100"><Navbar page={page} onNavigate={navigate} />{storageNotice && <div className="border-b border-amber-900 bg-amber-950 px-4 py-2 text-center text-xs text-amber-200" role="status">{storageNotice}</div>}<div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9">{content}</div><footer className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-zinc-800 px-4 py-6 text-[11px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span>Recall/AI · Turn notes into knowledge.</span><span>AI can make mistakes. Verify important material.</span></footer></div>;
}
