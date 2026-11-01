import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ROLES } from '../data/mockData.js';
import { computeSkillGap, computeReadinessScore } from '../utils/skillGapEngine.js';
import { predictPlacementProbability } from '../utils/aiPredictiveModel.js';

const AppContext = createContext(null);

const STORAGE_KEY = 'placement-assistant-state-v2';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore corrupt storage
  }
  return {
    student: { name: '', email: '' },
    roleId: null,
    skillLevels: {}, // { [skillName]: 0-100 }
    quizScores: {}, // { [skillName]: 0-100 }
    completedResources: {}, // { [resourceUrl]: true }
    interviewScores: {}, // { [qId]: 0-100 }
    resumeData: null, // { atsScore, extractedSkills, missingKeywords, highlights }
    onboarded: false,
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadInitial);
  const [view, setView] = useState('student'); // 'student' | 'tpo'
  const [step, setStep] = useState(state.onboarded ? 'dashboard' : 'onboarding');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // storage unavailable — app still works in-memory for this session
    }
  }, [state]);

  const role = useMemo(() => ROLES.find((r) => r.id === state.roleId) || null, [state.roleId]);

  const studentSkillVector = useMemo(
    () =>
      Object.entries(state.skillLevels).map(([skill, level]) => ({
        skill,
        // Blend self-rated level with quiz score when a quiz was attempted
        level: state.quizScores[skill] != null ? Math.round((level + state.quizScores[skill]) / 2) : level,
      })),
    [state.skillLevels, state.quizScores]
  );

  const gapResult = useMemo(() => {
    if (!role) return { gaps: [], coveragePercent: 0 };
    return computeSkillGap(studentSkillVector, role.skills);
  }, [role, studentSkillVector]);

  const progressCompletion = useMemo(() => {
    const total = Object.keys(state.completedResources).filter((k) => state.completedResources[k]).length;
    return Math.min(100, Math.round((total / 10) * 100));
  }, [state.completedResources]);

  const quizAvg = useMemo(() => {
    const scores = Object.values(state.quizScores);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [state.quizScores]);

  const interviewAvgScore = useMemo(() => {
    const scores = Object.values(state.interviewScores || {});
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [state.interviewScores]);

  const atsScore = useMemo(() => {
    return state.resumeData?.atsScore ?? null;
  }, [state.resumeData]);

  const readinessScore = useMemo(
    () =>
      computeReadinessScore({
        coveragePercent: gapResult.coveragePercent,
        quizAvg,
        progressCompletion,
      }),
    [gapResult.coveragePercent, quizAvg, progressCompletion]
  );

  // AI Machine Learning Predictive Placement Probability & XAI
  const placementPrediction = useMemo(() => {
    return predictPlacementProbability({
      coveragePercent: gapResult.coveragePercent,
      quizAvg,
      progressCompletion,
      interviewScore: interviewAvgScore ?? 55,
      atsScore: atsScore ?? 50,
    });
  }, [gapResult.coveragePercent, quizAvg, progressCompletion, interviewAvgScore, atsScore]);

  const actions = {
    setStudent: (student) => setState((s) => ({ ...s, student })),
    setRole: (roleId) => setState((s) => ({ ...s, roleId })),
    setSkillLevel: (skill, level) =>
      setState((s) => ({ ...s, skillLevels: { ...s.skillLevels, [skill]: level } })),
    setMultipleSkillLevels: (newLevels) =>
      setState((s) => ({ ...s, skillLevels: { ...s.skillLevels, ...newLevels } })),
    setQuizScore: (skill, score) =>
      setState((s) => ({ ...s, quizScores: { ...s.quizScores, [skill]: score } })),
    setInterviewScore: (qId, score) =>
      setState((s) => ({ ...s, interviewScores: { ...(s.interviewScores || {}), [qId]: score } })),
    setResumeData: (data) =>
      setState((s) => ({ ...s, resumeData: data })),
    toggleResourceComplete: (url) =>
      setState((s) => ({
        ...s,
        completedResources: { ...s.completedResources, [url]: !s.completedResources[url] },
      })),
    completeOnboarding: () => {
      setState((s) => ({ ...s, onboarded: true }));
      setStep('assessment');
    },
    resetAll: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(loadInitial());
      setStep('onboarding');
    },
  };

  const value = {
    state,
    role,
    gapResult,
    readinessScore,
    quizAvg,
    progressCompletion,
    interviewAvgScore,
    atsScore,
    placementPrediction,
    view,
    setView,
    step,
    setStep,
    ...actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
