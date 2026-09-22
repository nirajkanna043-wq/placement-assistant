import React, { useState } from 'react';
import { QUIZ_BANK } from '../data/mockData.js';
import { useApp } from '../context/AppContext.jsx';

export default function SkillAssessment() {
  const { role, state, setSkillLevel, setQuizScore, setStep } = useApp();
  const [activeQuiz, setActiveQuiz] = useState(null); // skill name
  const [quizAnswers, setQuizAnswers] = useState({});

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const submitQuiz = (skill) => {
    const questions = QUIZ_BANK[skill] || [];
    const correct = questions.filter((q, i) => quizAnswers[i] === q.answer).length;
    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    setQuizScore(skill, score);
    setActiveQuiz(null);
    setQuizAnswers({});
  };

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-runway tracking-wide">STEP 2</p>
      <h2 className="font-display text-3xl mt-1 mb-2">Rate your current skills</h2>
      <p className="text-ink/60 mb-8">
        Self-rate each skill required for <strong>{role.name}</strong>. Where a quick diagnostic
        quiz is available, take it — quiz results are blended with your self-rating for a more
        accurate skill-gap calculation.
      </p>

      <div className="space-y-4">
        {role.skills.map(({ skill, weight }) => {
          const level = state.skillLevels[skill] ?? 0;
          const quizScore = state.quizScores[skill];
          const hasQuiz = Boolean(QUIZ_BANK[skill]);

          return (
            <div key={skill} className="bg-white border border-line rounded p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{skill}</p>
                  <p className="text-xs text-ink/40">{weight}% weight for this role</p>
                </div>
                {hasQuiz && (
                  <button
                    onClick={() => setActiveQuiz(activeQuiz === skill ? null : skill)}
                    className="text-xs text-runway underline"
                  >
                    {quizScore != null ? `Quiz: ${quizScore}%` : 'Take diagnostic quiz'}
                  </button>
                )}
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={level}
                onChange={(e) => setSkillLevel(skill, Number(e.target.value))}
                className="w-full accent-runway"
              />
              <div className="flex justify-between text-xs text-ink/40 mt-1">
                <span>No experience</span>
                <span className="font-mono">{level}/100</span>
                <span>Expert</span>
              </div>

              {activeQuiz === skill && (
                <div className="mt-4 border-t border-line pt-4 space-y-3">
                  {QUIZ_BANK[skill].map((q, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium mb-1.5">{q.q}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => setQuizAnswers((a) => ({ ...a, [i]: oi }))}
                            className={`text-left text-sm px-3 py-2 rounded border ${
                              quizAnswers[i] === oi ? 'border-runway bg-runway/5' : 'border-line'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => submitQuiz(skill)}
                    className="bg-runway text-white text-sm px-4 py-2 rounded mt-1"
                  >
                    Submit quiz
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setStep('dashboard')}
        className="mt-6 bg-ink text-white px-6 py-3 rounded hover:bg-ink/90"
      >
        See my skill gaps →
      </button>
    </div>
  );
}
