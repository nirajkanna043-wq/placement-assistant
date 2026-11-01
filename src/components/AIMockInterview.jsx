import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { INTERVIEW_QUESTIONS, evaluateInterviewResponse } from '../utils/aiInterviewEngine.js';

export default function AIMockInterview() {
  const { role, state, setInterviewScore, setStep } = useApp();
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const questions = INTERVIEW_QUESTIONS[role.id] || INTERVIEW_QUESTIONS.sde;
  const currentQ = questions.find((q) => q.id === selectedQuestionId) || questions[0];

  const handleSelectQuestion = (q) => {
    setSelectedQuestionId(q.id);
    setAnswerText('');
    setEvaluation(null);
  };

  const handleEvaluate = () => {
    if (!answerText.trim()) return;
    setEvaluating(true);
    setTimeout(() => {
      const result = evaluateInterviewResponse(answerText, currentQ);
      setEvaluation(result);
      setInterviewScore(currentQ.id, result.overallScore);
      setEvaluating(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-1">
        <p className="font-mono text-xs text-runway tracking-wide">AI INTERVIEW SIMULATOR</p>
        <span className="text-[10px] bg-runway/10 text-runway font-mono px-2 py-0.5 rounded">NLP Rubric & STAR Evaluation</span>
      </div>
      <h2 className="font-display text-3xl mt-1 mb-2">AI Mock Interview Practice</h2>
      <p className="text-ink/60 mb-6">
        Simulate real placement technical and behavioral rounds. The AI rubric checks your technical terminology, trade-off analysis, and STAR (Situation, Task, Action, Result) methodology.
      </p>

      {/* Question Selector Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const recordedScore = state.interviewScores?.[q.id];
          const isSelected = (currentQ.id === q.id);
          return (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(q)}
              className={`text-left px-4 py-3 rounded border transition-colors flex-1 min-w-[200px] ${
                isSelected ? 'border-runway bg-runway/5 shadow-sm' : 'border-line bg-white hover:border-ink/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] text-ink/40">Round 0{idx + 1}</span>
                {recordedScore != null && (
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-runway/10 text-runway font-semibold">
                    {recordedScore}%
                  </span>
                )}
              </div>
              <p className="font-medium text-xs truncate">{q.title}</p>
              <p className="text-[10px] text-ink/50 mt-0.5">{q.type}</p>
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <div className="bg-white border border-line rounded p-6 mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-line pb-3">
          <span className="text-xs font-mono uppercase tracking-wide text-runway font-semibold">
            {currentQ.type}
          </span>
          <span className="text-xs text-ink/40">Role: {role.name}</span>
        </div>
        <h3 className="font-display text-lg mb-2">{currentQ.title}</h3>
        <p className="text-sm text-ink/80 leading-relaxed mb-4 bg-parchment p-3.5 rounded border border-line/60">
          "{currentQ.prompt}"
        </p>

        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-2">
          Your Answer / Spoken Transcript:
        </label>
        <textarea
          rows={6}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Type your structured answer here. For behavioral questions, use the STAR format (Situation, Task, Action, Result). For technical questions, mention edge cases and trade-offs..."
          className="w-full text-sm border border-line rounded p-3 mb-3 outline-none focus:border-runway font-body"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-ink/40 font-mono">
            {answerText.split(/\s+/).filter(Boolean).length} words
          </span>
          <button
            onClick={handleEvaluate}
            disabled={evaluating || !answerText.trim()}
            className="bg-runway text-white text-xs px-5 py-2.5 rounded hover:bg-runwayDark disabled:opacity-50 font-medium"
          >
            {evaluating ? 'Analyzing with AI Rubric…' : 'Submit for AI Evaluation'}
          </button>
        </div>
      </div>

      {/* AI Evaluation Result Card */}
      {evaluation && (
        <div className="bg-white border border-line rounded p-6 mb-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-xs text-ink/50 uppercase tracking-wide">Overall AI Interview Score</p>
              <p className="font-display text-3xl font-bold text-runway mt-0.5">
                {evaluation.overallScore}/100
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-3 py-1 bg-paper rounded border border-line">
                <p className="text-[10px] text-ink/40">Technical Depth</p>
                <p className="font-mono font-bold text-sm text-ink">{evaluation.technicalDepthScore}%</p>
              </div>
              <div className="text-center px-3 py-1 bg-paper rounded border border-line">
                <p className="text-[10px] text-ink/40">STAR / Structure</p>
                <p className="font-mono font-bold text-sm text-ink">{evaluation.structureScore}%</p>
              </div>
              <div className="text-center px-3 py-1 bg-paper rounded border border-line">
                <p className="text-[10px] text-ink/40">Clarity</p>
                <p className="font-mono font-bold text-sm text-ink">{evaluation.communicationScore}%</p>
              </div>
            </div>
          </div>

          {/* Feedback Points */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-paper/60 border border-line rounded p-4">
              <p className="text-xs font-semibold text-runway mb-2 flex items-center gap-1.5">
                <span>✓</span> Key Strengths
              </p>
              <ul className="text-xs space-y-1.5 text-ink/80">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-runway mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-paper/60 border border-line rounded p-4">
              <p className="text-xs font-semibold text-rust mb-2 flex items-center gap-1.5">
                <span>⚡</span> Improvement Opportunities
              </p>
              <ul className="text-xs space-y-1.5 text-ink/80">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rust mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Exemplar Model Answer */}
          <div className="bg-parchment border border-line rounded p-4">
            <p className="text-xs font-semibold text-ink/70 uppercase tracking-wide mb-1.5">
              💡 Exemplary Answer (Gold Standard Response):
            </p>
            <p className="text-xs text-ink/80 leading-relaxed italic">
              "{evaluation.idealAnswer}"
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setStep('dashboard')}
          className="text-xs text-ink/60 hover:text-ink underline"
        >
          ← Back to Skill Gaps & Placement Probability
        </button>
        <button
          onClick={() => setStep('plan')}
          className="bg-ink text-white px-5 py-2.5 rounded text-xs hover:bg-ink/90"
        >
          Proceed to Weekly Plan →
        </button>
      </div>
    </div>
  );
}
