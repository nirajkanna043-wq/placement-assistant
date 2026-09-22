import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const STUDENT_STEPS = [
  { id: 'onboarding', label: 'Profile & Role' },
  { id: 'assessment', label: 'Skill Assessment' },
  { id: 'dashboard', label: 'Skill Gaps' },
  { id: 'plan', label: 'Weekly Plan' },
  { id: 'progress', label: 'Progress' },
];

export default function Sidebar() {
  const { view, setView, step, setStep, state, readinessScore, resetAll } = useApp();

  return (
    <aside className="w-64 shrink-0 bg-ink text-parchment flex flex-col min-h-screen">
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <p className="font-mono text-[11px] tracking-wide text-amber">LANE 01</p>
        <h1 className="font-display text-2xl leading-tight mt-1">Readiness</h1>
        <p className="text-white/50 text-sm mt-1">Placement Prep Assistant</p>
      </div>

      <div className="px-6 py-5 flex gap-2 border-b border-white/10">
        {['student', 'tpo'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 text-sm py-2 rounded transition-colors ${
              view === v ? 'bg-runway text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {v === 'student' ? 'Student' : 'TPO'}
          </button>
        ))}
      </div>

      {view === 'student' && (
        <nav className="px-3 py-5 flex-1">
          {STUDENT_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`w-full text-left px-3 py-2.5 mb-1 rounded flex items-center gap-3 text-sm transition-colors ${
                step === s.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <span className="font-mono text-xs text-amber">{String(i + 1).padStart(2, '0')}</span>
              {s.label}
            </button>
          ))}
        </nav>
      )}

      <div className="mt-auto px-6 py-5 border-t border-white/10">
        {view === 'student' && (
          <div className="mb-4">
            <p className="text-white/40 text-xs uppercase tracking-wide">Readiness score</p>
            <p className="font-display text-3xl text-amber">{readinessScore}</p>
          </div>
        )}
        <p className="text-white/30 text-xs truncate">{state.student.name || 'No profile yet'}</p>
        <button onClick={resetAll} className="text-white/30 hover:text-white/60 text-xs mt-2 underline">
          Reset demo data
        </button>
      </div>
    </aside>
  );
}
