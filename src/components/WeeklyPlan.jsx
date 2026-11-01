import React, { useMemo, useState } from 'react';
import { RESOURCE_MAP } from '../data/mockData.js';
import { buildWeeklyPlan } from '../utils/skillGapEngine.js';
import { useApp } from '../context/AppContext.jsx';
import { generatePlanNarrative, askAIMentor } from '../utils/llmClient.js';

export default function WeeklyPlan() {
  const { role, gapResult, state, readinessScore, interviewAvgScore, toggleResourceComplete, setStep } = useApp();
  const [narrative, setNarrative] = useState('');
  const [loadingNarrative, setLoadingNarrative] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [mentorResponse, setMentorResponse] = useState('');
  const [mentorLoading, setMentorLoading] = useState(false);

  const plan = useMemo(() => buildWeeklyPlan(gapResult.gaps, RESOURCE_MAP, 4), [gapResult.gaps]);

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const handleGenerateNarrative = async () => {
    setLoadingNarrative(true);
    const text = await generatePlanNarrative({
      studentName: state.student.name,
      role: role.name,
      plan,
      gaps: gapResult.gaps,
      interviewScore: interviewAvgScore,
    });
    setNarrative(text);
    setLoadingNarrative(false);
  };

  const handleAskMentor = async (e) => {
    e?.preventDefault();
    if (!userQuery.trim()) return;
    setMentorLoading(true);
    const answer = await askAIMentor(userQuery, {
      roleName: role.name,
      readiness: readinessScore,
    });
    setMentorResponse(answer);
    setMentorLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-mono text-xs text-runway tracking-wide">STEP 4</p>
          <span className="text-[10px] bg-runway/10 text-runway font-mono px-2 py-0.5 rounded font-semibold">
            Personalized AI Curriculum
          </span>
        </div>
        <h2 className="font-display text-3xl mt-1 mb-2">Personalized AI Roadmap</h2>
        <p className="text-ink/60">
          Prioritized curriculum structured around your highest-impact skill gaps. Checking off completed resources directly accelerates your placement readiness score and predictive probability.
        </p>
      </div>

      {/* AI Coaching Summary Card */}
      <div className="bg-white border border-line rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-runway text-white font-mono px-1.5 py-0.5 rounded font-bold">AI</span>
            <p className="font-semibold text-sm">Personalized Strategic Coaching Roadmap</p>
          </div>
          <button
            onClick={handleGenerateNarrative}
            disabled={loadingNarrative}
            className="text-xs bg-runway text-white px-3.5 py-1.5 rounded hover:bg-runwayDark disabled:opacity-50 font-medium transition-colors"
          >
            {loadingNarrative ? 'Synthesizing with AI…' : narrative ? 'Regenerate Narrative' : 'Generate with AI'}
          </button>
        </div>
        <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">
          {narrative || 'Click "Generate with AI" to generate a tailored multi-week preparation roadmap with actionable tactics for your target recruitment role.'}
        </p>
      </div>

      {/* Interactive Ask AI Mentor Section */}
      <div className="bg-paper border border-line rounded p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">💬</span>
          <h3 className="font-display text-base font-bold">Ask AI Placement Mentor</h3>
        </div>
        <p className="text-xs text-ink/60 mb-3">
          Have questions about interview preparation, DSA strategies, or system design? Ask your AI coach below:
        </p>

        <form onSubmit={handleAskMentor} className="flex gap-2 mb-3">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g., 'How to master Dynamic Programming in 2 weeks?' or 'What SQL topics are asked most?'"
            className="flex-1 text-xs border border-line rounded px-3 py-2 bg-white outline-none focus:border-runway font-body"
          />
          <button
            type="submit"
            disabled={mentorLoading || !userQuery.trim()}
            className="bg-ink text-white text-xs px-4 py-2 rounded hover:bg-ink/90 disabled:opacity-40 font-medium shrink-0"
          >
            {mentorLoading ? 'Thinking…' : 'Ask Mentor'}
          </button>
        </form>

        {mentorResponse && (
          <div className="bg-white border border-line rounded p-3.5 text-xs text-ink/80 leading-relaxed whitespace-pre-line shadow-xs">
            <div className="flex items-center gap-1.5 font-semibold text-runway mb-1.5 font-mono text-[11px]">
              <span>💡</span> AI MENTOR GUIDANCE:
            </div>
            {mentorResponse}
          </div>
        )}
      </div>

      {/* Weekly Plan Items */}
      <div className="space-y-6">
        {plan.map((week) => (
          <div key={week.week} className="lane pl-4" style={{ '--lane-color': '#2F6F6F' }}>
            <p className="font-display text-lg mb-3 font-bold text-ink">Week {week.week}</p>
            <div className="space-y-3">
              {week.items.map((item) => (
                <div key={item.skill} className="bg-white border border-line rounded p-4 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm text-ink">{item.skill}</p>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-paper border border-line text-ink/60">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink/60 mb-3">{item.explanation}</p>
                  <div className="space-y-2 border-t border-line/60 pt-2.5">
                    {item.resources.map((r) => (
                      <label key={r.url} className="flex items-center gap-2.5 text-xs text-ink/80 hover:text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!state.completedResources[r.url]}
                          onChange={() => toggleResourceComplete(r.url)}
                          className="accent-runway w-3.5 h-3.5"
                        />
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex-1"
                        >
                          {r.title}
                        </a>
                        <span className="text-[10px] text-ink/40 font-mono px-1.5 py-0.5 bg-paper rounded border border-line">
                          {r.type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setStep('interview')}
          className="text-xs text-ink/60 hover:text-ink underline"
        >
          ← Practice AI Mock Interview
        </button>
        <button
          onClick={() => setStep('progress')}
          className="bg-ink text-white px-6 py-3 rounded hover:bg-ink/90 text-xs font-semibold"
        >
          Go to Progress Tracker →
        </button>
      </div>
    </div>
  );
}
