import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import ReadinessGauge from './ReadinessGauge.jsx';

export default function ProgressTracker() {
  const { role, readinessScore, quizAvg, progressCompletion, gapResult, state } = useApp();

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const completedCount = Object.values(state.completedResources).filter(Boolean).length;

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-runway tracking-wide">STEP 5</p>
      <h2 className="font-display text-3xl mt-1 mb-2">Progress & readiness</h2>
      <p className="text-ink/60 mb-8">
        Every resource you check off in your weekly plan, and every quiz you retake, updates this
        score — so it reflects where you actually stand, not just where you started.
      </p>

      <div className="grid grid-cols-[auto_1fr] gap-8 items-center bg-white border border-line rounded p-6 mb-6">
        <ReadinessGauge score={readinessScore} size={160} />
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Skill coverage" value={`${gapResult.coveragePercent}%`} />
          <Stat label="Quiz average" value={`${quizAvg}%`} />
          <Stat label="Plan completion" value={`${progressCompletion}%`} />
        </div>
      </div>

      <div className="bg-white border border-line rounded p-6">
        <p className="font-medium text-sm mb-3">Resources completed</p>
        <p className="font-display text-2xl mb-1">{completedCount}</p>
        <p className="text-xs text-ink/50">
          Mark resources complete from the Weekly Plan step — this feeds directly into your
          readiness score above.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink/50 mb-1">{label}</p>
      <p className="font-display text-xl">{value}</p>
    </div>
  );
}
