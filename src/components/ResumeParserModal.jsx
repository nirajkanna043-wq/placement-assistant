import React, { useState } from 'react';
import { parseResumeSkills, SAMPLE_RESUMES } from '../utils/aiNlpEngine.js';
import { useApp } from '../context/AppContext.jsx';

export default function ResumeParserModal({ isOpen, onClose }) {
  const { role, setMultipleSkillLevels, setResumeData } = useApp();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const roleSkills = role?.skills || [];

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const result = parseResumeSkills(text, roleSkills);
    setAnalysis(result);
    setApplied(false);
  };

  const handleLoadSample = (key) => {
    const sample = SAMPLE_RESUMES[key];
    if (sample) {
      setText(sample);
      const result = parseResumeSkills(sample, roleSkills);
      setAnalysis(result);
      setApplied(false);
    }
  };

  const handleApplyToProfile = () => {
    if (!analysis) return;
    const newSkills = {};
    Object.entries(analysis.extractedSkills).forEach(([skill, meta]) => {
      newSkills[skill] = meta.level;
    });
    setMultipleSkillLevels(newSkills);
    setResumeData(analysis);
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-line rounded-lg max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 bg-runway/10 text-runway rounded font-bold">AI NLP</span>
            <h3 className="font-display text-xl font-semibold">Resume & Portfolio Skill Extractor</h3>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-xl leading-none">
            &times;
          </button>
        </div>

        <p className="text-xs text-ink/70 mb-3">
          Paste your resume text or project summaries below. Our Natural Language Processing (NLP) entity extraction engine scans technical keywords, evaluates contextual depth, and estimates ATS match scores for <strong>{role?.name || 'your role'}</strong>.
        </p>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-ink/50 font-medium">Load benchmark sample:</span>
          <button
            onClick={() => handleLoadSample('sde')}
            className="text-xs bg-paper px-2 py-1 rounded border border-line hover:border-runway"
          >
            SDE Resume
          </button>
          <button
            onClick={() => handleLoadSample('dataAnalyst')}
            className="text-xs bg-paper px-2 py-1 rounded border border-line hover:border-runway"
          >
            Data Analyst Resume
          </button>
          <button
            onClick={() => handleLoadSample('frontend')}
            className="text-xs bg-paper px-2 py-1 rounded border border-line hover:border-runway"
          >
            Frontend Resume
          </button>
        </div>

        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste resume content here (e.g. education, skills, projects, technologies used)..."
          className="w-full text-xs font-mono border border-line rounded p-3 mb-3 outline-none focus:border-runway"
        />

        <div className="flex justify-between items-center mb-5">
          <button
            onClick={handleAnalyze}
            disabled={!text.trim()}
            className="bg-runway text-white text-xs px-4 py-2 rounded hover:bg-runwayDark disabled:opacity-50"
          >
            Extract Skills with NLP
          </button>
          {text.trim() && (
            <span className="text-xs font-mono text-ink/40">
              {text.split(/\s+/).filter(Boolean).length} tokens detected
            </span>
          )}
        </div>

        {analysis && (
          <div className="bg-paper border border-line rounded p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <p className="text-xs text-ink/50">ATS Role Match Score</p>
                <p className="font-display text-2xl font-bold text-runway">{analysis.atsScore}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/50">Matched Core Competencies</p>
                <p className="font-mono text-sm font-semibold">
                  {analysis.matchedRoleCount} of {analysis.totalRoleCount} skills
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-ink/70 mb-2 uppercase tracking-wide">
                Detected Technical Entities & Extracted Levels:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(analysis.extractedSkills).map(([skill, meta]) => (
                  <div key={skill} className="bg-white border border-line rounded p-2 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium truncate">{skill}</span>
                      <span className="font-mono text-runway font-semibold">{meta.level}%</span>
                    </div>
                    <div className="w-full bg-paper rounded h-1.5 overflow-hidden">
                      <div
                        className="bg-runway h-full rounded transition-all duration-300"
                        style={{ width: `${meta.level}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-ink/40 mt-1 truncate">
                      Keywords: {meta.matchedTerms.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {analysis.missingKeywords.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-rust mb-1">Missing Target Keywords for this Role:</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingKeywords.map((kw) => (
                    <span key={kw} className="text-[11px] bg-rust/10 text-rust border border-rust/20 px-2 py-0.5 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs text-ink/60">
                Click below to auto-populate your skill ratings with these NLP-verified levels.
              </p>
              <button
                onClick={handleApplyToProfile}
                disabled={applied}
                className={`text-xs px-4 py-2 rounded text-white font-medium ${
                  applied ? 'bg-runway' : 'bg-ink hover:bg-ink/90'
                }`}
              >
                {applied ? '✓ Applied to Profile!' : 'Apply Skills to Assessment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
