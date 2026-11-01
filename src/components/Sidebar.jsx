import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import AIModelExplainerModal from './AIModelExplainerModal.jsx';
import { getSavedApiKey, saveApiKey } from '../utils/llmClient.js';

const STUDENT_STEPS = [
  { id: 'onboarding', label: 'Profile & Role' },
  { id: 'assessment', label: 'Skill Assessment' },
  { id: 'dashboard', label: 'Skill Gaps & ML' },
  { id: 'interview', label: 'AI Mock Interview', badge: 'AI' },
  { id: 'plan', label: 'AI Weekly Plan' },
  { id: 'progress', label: 'Progress' },
];

export default function Sidebar() {
  const { view, setView, step, setStep, state, readinessScore, placementPrediction, resetAll } = useApp();
  const [showExplainer, setShowExplainer] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getSavedApiKey);

  const handleSaveKey = () => {
    saveApiKey(apiKeyInput);
    setShowConfig(false);
  };

  return (
    <aside className="w-64 shrink-0 bg-ink text-parchment flex flex-col min-h-screen">
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] tracking-wide text-amber">AI COURSE PROJECT</p>
          <span className="text-[10px] font-mono bg-runway text-white px-1.5 py-0.5 rounded">v2.0-AI</span>
        </div>
        <h1 className="font-display text-2xl leading-tight mt-1">Readiness</h1>
        <p className="text-white/50 text-xs mt-1">AI-Powered Placement Prep Assistant</p>
      </div>

      {/* Role View Toggle */}
      <div className="px-6 py-4 flex gap-2 border-b border-white/10">
        {['student', 'tpo'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 text-xs py-2 rounded transition-colors font-medium ${
              view === v ? 'bg-runway text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {v === 'student' ? 'Student View' : 'TPO Intel'}
          </button>
        ))}
      </div>

      {/* Navigation */}
      {view === 'student' && (
        <nav className="px-3 py-4 flex-1">
          {STUDENT_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`w-full text-left px-3 py-2.5 mb-1 rounded flex items-center justify-between text-xs transition-colors ${
                step === s.id ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-amber">{String(i + 1).padStart(2, '0')}</span>
                <span>{s.label}</span>
              </div>
              {s.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-runway text-white font-bold">
                  {s.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      )}

      {/* Bottom Metrics & Actions */}
      <div className="mt-auto px-6 py-4 border-t border-white/10 space-y-3">
        {view === 'student' && (
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded border border-white/5">
            <div>
              <p className="text-white/40 text-[10px] uppercase font-mono tracking-wide">Readiness</p>
              <p className="font-display text-xl text-amber font-bold">{readinessScore}%</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase font-mono tracking-wide">ML Offer Prob</p>
              <p className="font-display text-xl text-white font-bold">
                {placementPrediction.probabilityPercent}%
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowExplainer(true)}
          className="w-full text-left text-xs bg-amber/10 border border-amber/30 text-amber hover:bg-amber/20 px-3 py-2 rounded flex items-center justify-between transition-colors font-medium"
        >
          <span>🧠 AI Architecture Spec</span>
          <span className="font-mono text-[10px]">Viva Docs</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
          <button
            onClick={() => setShowConfig(true)}
            className="hover:text-white/80 transition-colors flex items-center gap-1"
          >
            <span>⚙️</span> AI Config
          </button>
          <button onClick={resetAll} className="hover:text-white/80 underline transition-colors">
            Reset Data
          </button>
        </div>
      </div>

      <AIModelExplainerModal
        isOpen={showExplainer}
        onClose={() => setShowExplainer(false)}
      />

      {/* Optional AI Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white text-ink border border-line rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="font-display text-lg font-bold mb-2">Optional AI Provider Configuration</h3>
            <p className="text-xs text-ink/70 mb-4 leading-relaxed">
              The project includes a <strong>complete, fully autonomous client-side AI engine</strong> (NLP, Bayesian BKT, XAI, and Mock Interview Rubric) that runs seamlessly without any external API keys.
              <br /><br />
              If you wish to additionally connect live Google Gemini or OpenAI LLMs, enter your API key below:
            </p>

            <label className="block text-xs font-semibold mb-1 text-ink/80">Google Gemini API Key (optional):</label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full text-xs font-mono border border-line rounded px-3 py-2 mb-4 outline-none focus:border-runway"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfig(false)}
                className="text-xs px-3 py-1.5 rounded border border-line hover:bg-paper"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="text-xs bg-runway text-white px-4 py-1.5 rounded hover:bg-runwayDark font-medium"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
