import React, { useState } from 'react';
import { ROLES } from '../data/mockData.js';
import { useApp } from '../context/AppContext.jsx';

export default function StudentOnboarding() {
  const { state, setStudent, setRole, completeOnboarding } = useApp();
  const [name, setName] = useState(state.student.name);
  const [email, setEmail] = useState(state.student.email);
  const [roleId, setRoleId] = useState(state.roleId);

  const canContinue = name.trim() && email.trim() && roleId;

  const handleContinue = () => {
    setStudent({ name, email });
    setRole(roleId);
    completeOnboarding();
  };

  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs text-runway tracking-wide">STEP 1</p>
      <h2 className="font-display text-3xl mt-1 mb-2">Set up your profile</h2>
      <p className="text-ink/60 mb-8">
        Tell us who you are and which role you're preparing for. Everything after this — your skill
        gaps, your weekly plan, your readiness score — is built around this target role.
      </p>

      <div className="space-y-5 bg-white border border-line rounded p-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full border border-line rounded px-3 py-2.5 outline-none focus:border-runway"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">College email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="priya@college.edu"
            className="w-full border border-line rounded px-3 py-2.5 outline-none focus:border-runway"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Target job role</label>
          <div className="grid grid-cols-1 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoleId(r.id)}
                className={`text-left border rounded px-4 py-3 transition-colors ${
                  roleId === r.id ? 'border-runway bg-runway/5' : 'border-line hover:border-ink/30'
                }`}
              >
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-ink/50 mt-0.5">{r.skills.length} core skills tracked</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="mt-6 bg-ink text-white px-6 py-3 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink/90"
      >
        Continue to skill assessment →
      </button>
    </div>
  );
}
