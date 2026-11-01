import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CODING_PROBLEMS, analyzeCodeSubmission } from '../utils/aiCodeEvaluator.js';

export default function AICodeSandbox() {
  const { role, setStep } = useApp();
  const [activeProblemId, setActiveProblemId] = useState(CODING_PROBLEMS[0].id);
  const [code, setCode] = useState(CODING_PROBLEMS[0].starterCode);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showExemplar, setShowExemplar] = useState(false);

  const currentProblem = CODING_PROBLEMS.find((p) => p.id === activeProblemId) || CODING_PROBLEMS[0];

  const handleSelectProblem = (prob) => {
    setActiveProblemId(prob.id);
    setCode(prob.starterCode);
    setAnalysis(null);
    setShowExemplar(false);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const res = analyzeCodeSubmission(code, currentProblem);
      setAnalysis(res);
      setAnalyzing(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-mono text-xs text-runway tracking-wide">AI TECHNICAL SANDBOX</p>
          <span className="text-[10px] bg-runway/10 text-runway font-mono px-2 py-0.5 rounded font-semibold">
            Static AST & Big-O Complexity Engine
          </span>
        </div>
        <h2 className="font-display text-3xl mt-1 mb-2">Live AI Code Evaluator</h2>
        <p className="text-ink/60">
          Solve core placement coding questions. Our AI static analysis engine computes algorithmic Big-O complexity, detects nested loop bottlenecks, tests edge-case resilience, and suggests production-grade optimizations.
        </p>
      </div>

      {/* Problem Selection Tabs */}
      <div className="flex gap-2">
        {CODING_PROBLEMS.map((prob) => {
          const isSelected = prob.id === currentProblem.id;
          return (
            <button
              key={prob.id}
              onClick={() => handleSelectProblem(prob)}
              className={`text-left px-4 py-2.5 rounded border text-xs transition-colors flex-1 ${
                isSelected
                  ? 'border-runway bg-runway/10 text-runway font-semibold shadow-xs'
                  : 'border-line bg-white text-ink/70 hover:border-ink/30'
              }`}
            >
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-mono text-[10px] text-ink/40">{prob.difficulty}</span>
                <span className="text-[10px] font-mono text-ink/50">{prob.category}</span>
              </div>
              <p className="font-medium text-xs truncate">{prob.title}</p>
            </button>
          );
        })}
      </div>

      {/* Problem Description Card */}
      <div className="bg-white border border-line rounded p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-mono text-runway uppercase tracking-wide font-bold">
              Problem Statement
            </span>
            <h3 className="font-display text-xl font-bold mt-0.5">{currentProblem.title}</h3>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 bg-paper rounded border border-line text-ink/60">
            Target Bar: {currentProblem.optimalComplexity}
          </span>
        </div>
        <p className="text-xs text-ink/80 whitespace-pre-line leading-relaxed mb-4 bg-paper/50 p-3 rounded border border-line/60">
          {currentProblem.description}
        </p>

        <div className="text-xs">
          <span className="font-semibold text-ink/70">Benchmark Test Cases:</span>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {currentProblem.testCases.map((tc, i) => (
              <div key={i} className="bg-paper p-2 rounded border border-line font-mono text-[11px]">
                <div className="text-ink/60 truncate">{tc.input}</div>
                <div className="text-runway font-semibold mt-0.5">Expected: {tc.expected}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="bg-ink border border-line rounded-lg overflow-hidden shadow-lg">
        <div className="bg-[#15191C] px-4 py-2 flex items-center justify-between border-b border-white/10 text-xs text-white/60">
          <span className="font-mono">solution.js</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-white/40">
              {code.split('\n').length} lines
            </span>
            <button
              onClick={() => setShowExemplar(!showExemplar)}
              className="text-amber hover:text-amber/80 text-[11px] font-mono underline"
            >
              {showExemplar ? 'Hide Exemplar Solution' : 'View AI Exemplar'}
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full bg-ink text-[#F8F8F2] font-mono text-xs p-4 outline-none resize-none leading-relaxed"
          style={{ tabSize: 2 }}
        />

        <div className="bg-[#15191C] px-4 py-3 flex items-center justify-between border-t border-white/10">
          <span className="text-[11px] text-white/40 font-mono">
            Static analyzer runs in browser sandbox
          </span>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-runway text-white text-xs px-5 py-2 rounded font-medium hover:bg-runwayDark transition-colors disabled:opacity-50"
          >
            {analyzing ? 'Analyzing AST & Complexity…' : '⚡ Run AI Code Analyzer'}
          </button>
        </div>
      </div>

      {/* AI Analysis Output */}
      {analysis && (
        <div className="bg-white border border-line rounded p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-xs text-ink/50 uppercase tracking-wide font-mono">
                Algorithmic Code Quality Score
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display text-3xl font-bold text-runway">{analysis.score}/100</span>
                <span className="text-xs text-ink/50">
                  {analysis.isOptimal ? '✓ Optimal Asymptotic Performance' : '⚠️ Sub-optimal Complexity Detected'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-paper border border-line rounded px-3 py-1.5 text-center">
                <p className="text-[10px] text-ink/40 font-mono uppercase">Time Complexity</p>
                <p className={`font-mono text-xs font-bold ${analysis.isOptimal ? 'text-runway' : 'text-rust'}`}>
                  {analysis.timeComplexity}
                </p>
              </div>
              <div className="bg-paper border border-line rounded px-3 py-1.5 text-center">
                <p className="text-[10px] text-ink/40 font-mono uppercase">Space Complexity</p>
                <p className="font-mono text-xs font-bold text-ink">
                  {analysis.spaceComplexity}
                </p>
              </div>
              <div className="bg-paper border border-line rounded px-3 py-1.5 text-center">
                <p className="text-[10px] text-ink/40 font-mono uppercase">Edge Case Resilience</p>
                <p className="font-mono text-xs font-bold text-ink">
                  {analysis.edgeCaseScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-paper/50 border border-line rounded p-4 text-xs">
              <p className="font-semibold text-runway mb-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span>✓</span> DETECTED STRENGTHS
              </p>
              <ul className="space-y-1.5 text-ink/80">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-runway mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-paper/50 border border-line rounded p-4 text-xs">
              <p className="font-semibold text-rust mb-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span>⚡</span> AI OPTIMIZATION RECOMMENDATIONS
              </p>
              <ul className="space-y-1.5 text-ink/80">
                {analysis.optimizations.map((opt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rust mt-0.5">•</span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Exemplar Solution Reveal */}
          {showExemplar && (
            <div className="bg-ink text-[#F8F8F2] p-4 rounded border border-line font-mono text-xs">
              <p className="text-amber font-semibold mb-2 text-[11px]">
                💡 Gold-Standard Production Solution ({currentProblem.optimalComplexity}):
              </p>
              <pre className="overflow-x-auto leading-relaxed">{analysis.exemplar}</pre>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setStep('interview')}
          className="text-xs text-ink/60 hover:text-ink underline"
        >
          ← Go to AI Mock Interview
        </button>
        <button
          onClick={() => setStep('lab')}
          className="bg-ink text-white px-5 py-2.5 rounded text-xs font-semibold hover:bg-ink/90 flex items-center gap-1.5"
        >
          <span>🧪</span> Open Interactive AI / ML Lab →
        </button>
      </div>
    </div>
  );
}
