import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { INTERVIEW_QUESTIONS, evaluateInterviewResponse } from '../utils/aiInterviewEngine.js';

export default function AIMockInterview() {
  const { role, state, setInterviewScore, setStep } = useApp();
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  // Speech Recognition & Synthesis states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const recognitionRef = useRef(null);

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const questions = INTERVIEW_QUESTIONS[role.id] || INTERVIEW_QUESTIONS.sde;
  const currentQ = questions.find((q) => q.id === selectedQuestionId) || questions[0];

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const handleToggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSpeakQuestion = () => {
    if (!window.speechSynthesis) return;
    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentQ.prompt);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeakingQuestion(true);
  };

  const handleSelectQuestion = (q) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeakingQuestion(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setSelectedQuestionId(q.id);
    setAnswerText('');
    setEvaluation(null);
  };

  const handleEvaluate = () => {
    if (!answerText.trim()) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setEvaluating(true);
    setTimeout(() => {
      const result = evaluateInterviewResponse(answerText, currentQ);
      setEvaluation(result);
      setInterviewScore(currentQ.id, result.overallScore);
      setEvaluating(false);
    }, 600);
  };

  // Compute live speaking statistics
  const words = answerText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const fillerRegex = /\b(um|uh|like|actually|basically|you know|sort of|kind of)\b/gi;
  const fillerMatches = answerText.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-mono text-xs text-runway tracking-wide">AI VOICE & RUBRIC SIMULATOR</p>
          <span className="text-[10px] bg-runway/10 text-runway font-mono px-2 py-0.5 rounded font-semibold">
            Speech Recognition + STAR Rubric Engine
          </span>
        </div>
        <h2 className="font-display text-3xl mt-1 mb-2">AI Mock Interview Practice</h2>
        <p className="text-ink/60">
          Practice speaking or typing answers to technical and behavioral prompts. Our NLP rubric evaluates your technical vocabulary, trade-off analysis, speech fluency, and STAR structure in real-time.
        </p>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const recordedScore = state.interviewScores?.[q.id];
          const isSelected = currentQ.id === q.id;
          return (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(q)}
              className={`text-left px-4 py-3 rounded border transition-colors flex-1 min-w-[200px] ${
                isSelected ? 'border-runway bg-runway/5 shadow-xs' : 'border-line bg-white hover:border-ink/30'
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
      <div className="bg-white border border-line rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wide text-runway font-semibold">
              {currentQ.type}
            </span>
            <span className="text-xs text-ink/40">Role: {role.name}</span>
          </div>

          <button
            onClick={handleSpeakQuestion}
            className={`text-xs px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 font-medium ${
              isSpeakingQuestion
                ? 'bg-rust text-white border-rust'
                : 'bg-paper text-ink/80 border-line hover:border-runway'
            }`}
          >
            <span>{isSpeakingQuestion ? '⏹ Stop Voice' : '🔊 AI Interviewer Voice'}</span>
          </button>
        </div>

        <h3 className="font-display text-lg mb-2 font-bold">{currentQ.title}</h3>
        <p className="text-sm text-ink/80 leading-relaxed mb-4 bg-parchment p-3.5 rounded border border-line/60">
          "{currentQ.prompt}"
        </p>

        {/* Answer Controls & Speech Input */}
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Candidate Response (Spoken or Typed):
          </label>
          <div className="flex items-center gap-2">
            {speechSupported && (
              <button
                onClick={handleToggleListen}
                className={`text-xs px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition-all ${
                  isListening
                    ? 'bg-rust text-white animate-pulse'
                    : 'bg-paper text-ink border border-line hover:border-runway'
                }`}
              >
                <span>🎙️</span>
                <span>{isListening ? 'Listening (Speak Now)…' : 'Speak Answer with Mic'}</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          rows={6}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Speak into your microphone or type your structured answer here. For behavioral questions, follow Situation, Task, Action, Result (STAR)..."
          className="w-full text-sm border border-line rounded p-3 mb-3 outline-none focus:border-runway font-body leading-relaxed"
        />

        {/* Live Audio / Fluency Diagnostics Bar */}
        <div className="flex items-center justify-between bg-paper p-3 rounded border border-line mb-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-mono text-ink/60">Words: <strong>{wordCount}</strong></span>
            <span className="font-mono text-ink/60">
              Filler Words: <strong className={fillerCount > 3 ? 'text-rust' : 'text-runway'}>{fillerCount}</strong>
            </span>
            <span className="font-mono text-ink/60">
              Fluency Status:{' '}
              <strong className={wordCount >= 60 ? 'text-runway' : 'text-amber'}>
                {wordCount >= 60 ? 'Comprehensive' : 'Elaborate Further'}
              </strong>
            </span>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={evaluating || !answerText.trim()}
            className="bg-runway text-white text-xs px-5 py-2 rounded hover:bg-runwayDark disabled:opacity-50 font-medium"
          >
            {evaluating ? 'Analyzing with AI Rubric…' : 'Submit for AI Rubric Evaluation'}
          </button>
        </div>
      </div>

      {/* AI Evaluation Result Card */}
      {evaluation && (
        <div className="bg-white border border-line rounded p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-xs text-ink/50 uppercase tracking-wide font-mono">
                Overall AI Interview Score
              </p>
              <p className="font-display text-4xl font-bold text-runway mt-0.5">
                {evaluation.overallScore}/100
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center px-3 py-1.5 bg-paper rounded border border-line">
                <p className="text-[10px] text-ink/40 font-mono uppercase">Technical Depth</p>
                <p className="font-mono font-bold text-sm text-ink">{evaluation.technicalDepthScore}%</p>
              </div>
              <div className="text-center px-3 py-1.5 bg-paper rounded border border-line">
                <p className="text-[10px] text-ink/40 font-mono uppercase">STAR Structure</p>
                <p className="font-mono font-bold text-sm text-ink">{evaluation.structureScore}%</p>
              </div>
              <div className="text-center px-3 py-1.5 bg-paper rounded border border-line">
                <p className="text-[10px] text-ink/40 font-mono uppercase">Clarity & Pace</p>
                <p className="font-mono font-bold text-sm text-ink">{evaluation.communicationScore}%</p>
              </div>
            </div>
          </div>

          {/* Feedback Points */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-paper/50 border border-line rounded p-4 text-xs">
              <p className="font-semibold text-runway mb-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span>✓</span> CANDIDATE STRENGTHS
              </p>
              <ul className="space-y-1.5 text-ink/80">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-runway mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-paper/50 border border-line rounded p-4 text-xs">
              <p className="font-semibold text-rust mb-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span>⚡</span> IMPROVEMENT OPPORTUNITIES
              </p>
              <ul className="space-y-1.5 text-ink/80">
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
            <p className="text-xs font-semibold text-ink/70 uppercase tracking-wide mb-1.5 font-mono text-[11px]">
              💡 Gold Standard / Exemplary Answer:
            </p>
            <p className="text-xs text-ink/80 leading-relaxed italic">
              "{evaluation.idealAnswer}"
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setStep('dashboard')}
          className="text-xs text-ink/60 hover:text-ink underline"
        >
          ← Back to Skill Gaps & Placement Probability
        </button>
        <button
          onClick={() => setStep('code')}
          className="bg-ink text-white px-5 py-2.5 rounded text-xs hover:bg-ink/90 font-medium flex items-center gap-1.5"
        >
          <span>💻</span> Proceed to AI Code Sandbox →
        </button>
      </div>
    </div>
  );
}
