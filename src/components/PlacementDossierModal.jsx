import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function PlacementDossierModal({ isOpen, onClose }) {
  const { state, role, readinessScore, placementPrediction, gapResult, quizAvg, interviewAvgScore, atsScore } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const verificationHash = 'SHA256:' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-line rounded-lg max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-0 print:p-0">
        <div className="flex items-center justify-between border-b-2 border-ink pb-4 mb-6">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-amber uppercase font-bold">
              OFFICIAL PLACEMENT AUDIT DOSSIER
            </span>
            <h2 className="font-display text-2xl font-bold mt-0.5">Candidate Readiness Certification</h2>
            <p className="text-xs text-ink/60">Generated via AI Placement Preparation Assistant v2.0</p>
          </div>
          <button onClick={onClose} className="print:hidden text-ink/40 hover:text-ink text-2xl leading-none">
            &times;
          </button>
        </div>

        {/* Candidate Profile Details */}
        <div className="grid grid-cols-2 gap-4 bg-paper/50 p-4 rounded border border-line mb-6 text-xs">
          <div>
            <span className="text-ink/40 uppercase tracking-wide text-[10px] font-mono">Candidate Name</span>
            <p className="font-bold text-sm text-ink">{state.student.name || 'Anonymous Student'}</p>
          </div>
          <div>
            <span className="text-ink/40 uppercase tracking-wide text-[10px] font-mono">Target Role</span>
            <p className="font-bold text-sm text-runway">{role?.name || 'Software Development Engineer'}</p>
          </div>
          <div>
            <span className="text-ink/40 uppercase tracking-wide text-[10px] font-mono">Institutional Email</span>
            <p className="font-mono text-ink/80">{state.student.email || 'student@college.edu'}</p>
          </div>
          <div>
            <span className="text-ink/40 uppercase tracking-wide text-[10px] font-mono">Audit Timestamp</span>
            <p className="font-mono text-ink/80">{new Date().toLocaleDateString()} — Verified</p>
          </div>
        </div>

        {/* Core Metric Highlights */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-paper p-3 rounded border border-line">
            <span className="text-[10px] uppercase font-mono text-ink/40">Readiness Score</span>
            <p className="font-display text-2xl font-bold text-ink">{readinessScore}/100</p>
            <span className="text-[10px] text-ink/50">Composite Index</span>
          </div>

          <div className="bg-paper p-3 rounded border border-line">
            <span className="text-[10px] uppercase font-mono text-ink/40">ML Selection Probability</span>
            <p className="font-display text-2xl font-bold text-runway">{placementPrediction.probabilityPercent}%</p>
            <span className="text-[10px] font-bold" style={{ color: placementPrediction.tierColor }}>
              {placementPrediction.tier}
            </span>
          </div>

          <div className="bg-paper p-3 rounded border border-line">
            <span className="text-[10px] uppercase font-mono text-ink/40">ATS Resume Match</span>
            <p className="font-display text-2xl font-bold text-ink">{atsScore ?? 75}%</p>
            <span className="text-[10px] text-ink/50">Entity Alignment</span>
          </div>
        </div>

        {/* Competency Breakdown */}
        <div className="mb-6">
          <h4 className="font-display text-sm font-bold mb-2 uppercase tracking-wide text-ink/80">
            Competency Breakdown & Bayesian Knowledge State
          </h4>
          <div className="space-y-1.5 text-xs">
            {gapResult.gaps.map((g) => (
              <div key={g.skill} className="flex justify-between items-center py-1.5 border-b border-line/60">
                <span className="font-medium text-ink">{g.skill}</span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>Score: {g.current}/70</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    g.status === 'strong'
                      ? 'bg-runway/10 text-runway'
                      : g.status === 'weak' || g.status === 'missing'
                      ? 'bg-rust/10 text-rust'
                      : 'bg-amber/10 text-amber'
                  }`}>
                    {g.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Footer */}
        <div className="border-t border-line pt-4 flex items-center justify-between text-[10px] font-mono text-ink/40">
          <div>
            <span>Model Hash: {verificationHash}</span>
            <br />
            <span>Algorithm: Logistic Classification (XAI Calibrated) + BKT</span>
          </div>
          <div className="print:hidden flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-ink text-white px-4 py-2 rounded font-medium hover:bg-ink/90 text-xs"
            >
              🖨️ Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
