import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ADAPTIVE_QUIZ_BANK, updateBayesianMastery } from '../utils/aiAdaptiveQuiz.js';
import ResumeParserModal from './ResumeParserModal.jsx';

export default function SkillAssessment() {
  const { role, state, setSkillLevel, setQuizScore, setStep } = useApp();
  const [activeQuizSkill, setActiveQuizSkill] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showParser, setShowParser] = useState(false);

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const handleOpenQuiz = (skill) => {
    setActiveQuizSkill(skill);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setAnswerSubmitted(false);
  };

  const handleOptionSelect = (idx) => {
    if (answerSubmitted) return;
    setSelectedOption(idx);
  };

  const activeQuestions = activeQuizSkill ? (ADAPTIVE_QUIZ_BANK[activeQuizSkill] || []) : [];
  const currentQ = activeQuestions[currentQIndex];

  const handleSubmitAnswer = () => {
    if (selectedOption == null) return;
    setAnswerSubmitted(true);

    const isCorrect = (selectedOption === currentQ.answer);
    const priorScore = state.quizScores[activeQuizSkill] ?? (state.skillLevels[activeQuizSkill] || 50);
    const updatedMastery = updateBayesianMastery(priorScore, isCorrect);
    setQuizScore(activeQuizSkill, updatedMastery);
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < activeQuestions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setAnswerSubmitted(false);
    } else {
      setActiveQuizSkill(null);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs text-runway tracking-wide">STEP 2</p>
          <span className="text-[10px] bg-runway/10 text-runway font-mono px-2 py-0.5 rounded font-semibold">
            Bayesian Knowledge Tracing
          </span>
        </div>
        <button
          onClick={() => setShowParser(true)}
          className="text-xs bg-paper border border-line hover:border-runway text-ink/80 px-2.5 py-1 rounded flex items-center gap-1.5"
        >
          <span>📄</span> AI Resume Extractor
        </button>
      </div>

      <h2 className="font-display text-3xl mt-1 mb-2">Rate & verify your current skills</h2>
      <p className="text-ink/60 mb-6">
        Self-rate each competency required for <strong>{role.name}</strong>. Take the adaptive diagnostic
        assessments: our <strong>Bayesian Knowledge Tracing (BKT)</strong> model dynamically adjusts question
        difficulty and updates your verified skill mastery.
      </p>

      {/* Adaptive Quiz Active Overlay Modal */}
      {activeQuizSkill && currentQ && (
        <div className="bg-white border-2 border-runway rounded-lg p-6 mb-8 shadow-md">
          <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wide text-runway font-bold">
                Adaptive Diagnostic Quiz
              </span>
              <h3 className="font-display text-lg font-bold">{activeQuizSkill}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-paper border border-line">
                Question {currentQIndex + 1} of {activeQuestions.length}
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded font-medium ${
                currentQ.difficulty === 'Hard'
                  ? 'bg-rust/10 text-rust'
                  : currentQ.difficulty === 'Medium'
                  ? 'bg-amber/10 text-amber'
                  : 'bg-runway/10 text-runway'
              }`}>
                {currentQ.difficulty}
              </span>
              <button
                onClick={() => setActiveQuizSkill(null)}
                className="text-ink/40 hover:text-ink text-sm ml-2 font-mono"
              >
                ✕
              </button>
            </div>
          </div>

          <p className="text-sm font-medium mb-4 text-ink">{currentQ.q}</p>

          <div className="space-y-2 mb-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'border-line hover:border-ink/40 bg-white';
              if (answerSubmitted) {
                if (idx === currentQ.answer) {
                  btnClass = 'border-runway bg-runway/10 text-runway font-medium';
                } else if (isSelected) {
                  btnClass = 'border-rust bg-rust/10 text-rust';
                }
              } else if (isSelected) {
                btnClass = 'border-runway bg-runway/5 text-runway font-medium';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left text-xs p-3 rounded border transition-colors ${btnClass}`}
                >
                  <span className="font-mono mr-2 text-ink/40">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {answerSubmitted && (
            <div className="p-3.5 bg-paper rounded border border-line mb-4 text-xs">
              <div className="flex items-center gap-1.5 font-semibold mb-1">
                {selectedOption === currentQ.answer ? (
                  <span className="text-runway">✓ Correct! Bayesian Mastery Updated</span>
                ) : (
                  <span className="text-rust">✗ Incorrect. Review the AI reasoning below:</span>
                )}
              </div>
              <p className="text-ink/80 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {!answerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption == null}
                className="bg-runway text-white text-xs px-4 py-2 rounded font-medium disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-ink text-white text-xs px-4 py-2 rounded font-medium"
              >
                {currentQIndex + 1 < activeQuestions.length ? 'Next Adaptive Question →' : 'Finish Quiz & Return'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Skill List with Sliders & Quiz Triggers */}
      <div className="space-y-4">
        {role.skills.map(({ skill, weight }) => {
          const selfLevel = state.skillLevels[skill] ?? 0;
          const quizScore = state.quizScores[skill];
          const hasQuiz = Boolean(ADAPTIVE_QUIZ_BANK[skill]);

          return (
            <div key={skill} className="bg-white border border-line rounded p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{skill}</p>
                  <p className="text-xs text-ink/40">{weight}% recruitment weight</p>
                </div>
                <div className="flex items-center gap-3">
                  {quizScore != null && (
                    <span className="text-xs font-mono font-semibold bg-runway/10 text-runway px-2 py-0.5 rounded">
                      Bayesian Verified: {quizScore}%
                    </span>
                  )}
                  {hasQuiz && (
                    <button
                      onClick={() => handleOpenQuiz(skill)}
                      className="text-xs bg-paper border border-line hover:border-runway text-runway px-2.5 py-1 rounded font-medium"
                    >
                      {quizScore != null ? 'Re-take Quiz' : 'Take Adaptive Quiz'}
                    </button>
                  )}
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={selfLevel}
                onChange={(e) => setSkillLevel(skill, Number(e.target.value))}
                className="w-full accent-runway"
              />
              <div className="flex justify-between text-[11px] text-ink/40 mt-1 font-mono">
                <span>Novice (0)</span>
                <span className="font-semibold text-ink/70">Self: {selfLevel}/100</span>
                <span>Placement Ready (100)</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep('onboarding')}
          className="text-xs text-ink/50 hover:text-ink underline"
        >
          ← Back to Profile
        </button>
        <button
          onClick={() => setStep('dashboard')}
          className="bg-ink text-white px-6 py-3 rounded hover:bg-ink/90 text-sm font-medium"
        >
          View AI Skill Gaps & Placement Probability →
        </button>
      </div>

      <ResumeParserModal
        isOpen={showParser}
        onClose={() => setShowParser(false)}
      />
    </div>
  );
}
