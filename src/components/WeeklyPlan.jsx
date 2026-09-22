import React, { useMemo, useState } from 'react';
import { RESOURCE_MAP } from '../data/mockData.js';
import { buildWeeklyPlan } from '../utils/skillGapEngine.js';
import { useApp } from '../context/AppContext.jsx';
import { generatePlanNarrative } from '../utils/llmClient.js';

export default function WeeklyPlan() {
  const { role, gapResult, state, toggleResourceComplete, setStep } = useApp();
  const [narrative, setNarrative] = useState('');
  const [loadingNarrative, setLoadingNarrative] = useState(false);

  const plan = useMemo(() => buildWeeklyPlan(gapResult.gaps, RESOURCE_MAP, 4), [gapResult.gaps]);

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const handleGenerateNarrative = async () => {
    setLoadingNarrative(true);
    const text = await generatePlanNarrative({ studentName: state.student.name, role: role.name, plan });
    setNarrative(text);
    setLoadingNarrative(false);
  };

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-runway tracking-wide">STEP 4</p>
      <h2 className="font-display text-3xl mt-1 mb-2">Your personalized weekly plan</h2>
      <p className="text-ink/60 mb-6">
        Built by the recommendation engine: for every unresolved skill gap it pulls curated
        resources and explains why that gap was prioritized. This is the structured input an LLM
        layer turns into readable coaching copy.
      </p>

      <div className="bg-white border border-line rounded p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-sm">AI coaching summary</p>
          <button
            onClick={handleGenerateNarrative}
            disabled={loadingNarrative}
            className="text-xs bg-runway text-white px-3 py-1.5 rounded disabled:opacity-50"
          >
            {loadingNarrative ? 'Generating…' : narrative ? 'Regenerate' : 'Generate with AI'}
          </button>
        </div>
        <p className="text-sm text-ink/70 whitespace-pre-line">
          {narrative || 'Click "Generate with AI" to have the LLM turn this plan into a friendly, readable weekly roadmap. See src/utils/llmClient.js for wiring this to a real backend.'}
        </p>
      </div>

      <div className="space-y-6">
        {plan.map((week) => (
          <div key={week.week} className="lane pl-4" style={{ '--lane-color': '#2F6F6F' }}>
            <p className="font-display text-lg mb-3">Week {week.week}</p>
            <div className="space-y-3">
              {week.items.map((item) => (
                <div key={item.skill} className="bg-white border border-line rounded p-4">
                  <p className="font-medium text-sm mb-1">{item.skill}</p>
                  <p className="text-xs text-ink/50 mb-3">{item.explanation}</p>
                  <div className="space-y-1.5">
                    {item.resources.map((r) => (
                      <label key={r.url} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!state.completedResources[r.url]}
                          onChange={() => toggleResourceComplete(r.url)}
                          className="accent-runway"
                        />
                        <a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">
                          {r.title}
                        </a>
                        <span className="text-xs text-ink/40 font-mono">{r.type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setStep('progress')} className="mt-8 bg-ink text-white px-6 py-3 rounded hover:bg-ink/90">
        Go to progress tracker →
      </button>
    </div>
  );
}
