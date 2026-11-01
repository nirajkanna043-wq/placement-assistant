import React, { useState } from 'react';
import { ROLES } from '../data/mockData.js';
import { useApp } from '../context/AppContext.jsx';
import ResumeParserModal from './ResumeParserModal.jsx';

export default function StudentOnboarding() {
  const { state, setStudent, setRole, completeOnboarding } = useApp();
  const [name, setName] = useState(state.student.name);
  const [email, setEmail] = useState(state.student.email);
  const [roleId, setRoleId] = useState(state.roleId);
  const [showParser, setShowParser] = useState(false);

  const canContinue = name.trim() && email.trim() && roleId;

  const handleContinue = () => {
    setStudent({ name, email });
    setRole(roleId);
    completeOnboarding();
  };

  const selectedRole = ROLES.find((r) => r.id === roleId);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <p className="font-mono text-xs text-runway tracking-wide">STEP 1</p>
        <span className="text-[10px] bg-amber/10 text-amber font-mono px-2 py-0.5 rounded font-semibold">
          AI Candidate Profiling
        </span>
      </div>
      <h2 className="font-display text-3xl mt-1 mb-2">Set up your placement profile</h2>
      <p className="text-ink/60 mb-6">
        Specify your target recruitment track. You can self-rate your skills manually, or let our
        built-in <strong>NLP Resume Parser</strong> automatically extract and calibrate your core competencies.
      </p>

      <div className="space-y-5 bg-white border border-line rounded p-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full border border-line rounded px-3 py-2.5 outline-none focus:border-runway text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">College email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="priya@college.edu"
            className="w-full border border-line rounded px-3 py-2.5 outline-none focus:border-runway text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Target recruitment role</label>
          <div className="grid grid-cols-1 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoleId(r.id)}
                className={`text-left border rounded px-4 py-3 transition-colors ${
                  roleId === r.id ? 'border-runway bg-runway/5' : 'border-line hover:border-ink/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">{r.name}</p>
                  <span className="font-mono text-xs text-ink/40">{r.skills.length} core competencies</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Resume Quick Parse Callout */}
      <div className="bg-paper border border-line rounded p-5 mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-runway text-white font-mono px-1.5 py-0.5 rounded">NEW</span>
            <p className="font-semibold text-sm">Have a resume or LinkedIn summary?</p>
          </div>
          <p className="text-xs text-ink/60">
            Our NLP engine will extract technical skills, evaluate ATS readiness, and calibrate initial ratings.
          </p>
          {state.resumeData && (
            <p className="text-xs text-runway font-semibold mt-1">
              ✓ Resume analyzed! ATS Score: {state.resumeData.atsScore}% ({state.resumeData.matchedRoleCount} competencies found)
            </p>
          )}
        </div>
        <button
          onClick={() => {
            if (!roleId) setRoleId('sde');
            setShowParser(true);
          }}
          className="bg-white border border-runway text-runway hover:bg-runway hover:text-white transition-colors text-xs px-3.5 py-2 rounded font-medium shrink-0 ml-4"
        >
          {state.resumeData ? 'Re-scan Resume' : 'Scan Resume with AI'}
        </button>
      </div>

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="bg-ink text-white px-6 py-3 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink/90 text-sm font-medium"
      >
        Continue to skill assessment →
      </button>

      <ResumeParserModal
        isOpen={showParser}
        onClose={() => setShowParser(false)}
      />
    </div>
  );
}
