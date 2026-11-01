import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import ReadinessGauge from './ReadinessGauge.jsx';
import { simulateSkillImprovement } from '../utils/aiPredictiveModel.js';

const STATUS_COLOR = {
  missing: '#B4532A',
  weak: '#D9A441',
  developing: '#5C8A8A',
  strong: '#2F6F6F',
};

const STATUS_LABEL = {
  missing: 'Missing',
  weak: 'Weak',
  developing: 'Developing',
  strong: 'Placement-ready',
};

export default function SkillGapDashboard() {
  const { role, gapResult, readinessScore, placementPrediction, quizAvg, progressCompletion, interviewAvgScore, atsScore, setStep } = useApp();
  const [simulatedSkill, setSimulatedSkill] = useState(null);

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const chartData = gapResult.gaps.map((g) => ({
    name: g.skill.length > 18 ? g.skill.slice(0, 16) + '…' : g.skill,
    current: g.current,
    status: g.status,
    rawName: g.skill,
    weight: g.weight,
  }));

  // Default simulated skill is the highest-weight weak skill
  const selectedSkillForSim = simulatedSkill
    ? gapResult.gaps.find((g) => g.skill === simulatedSkill)
    : gapResult.gaps.find((g) => g.status !== 'strong') || gapResult.gaps[0];

  const whatIfResult = selectedSkillForSim
    ? simulateSkillImprovement({
        currentFeatures: {
          coveragePercent: gapResult.coveragePercent,
          quizAvg,
          progressCompletion,
          interviewScore: interviewAvgScore ?? 55,
          atsScore: atsScore ?? 50,
        },
        skillName: selectedSkillForSim.skill,
        skillWeight: selectedSkillForSim.weight,
        currentSkillLevel: selectedSkillForSim.current,
        targetSkillLevel: 85,
      })
    : null;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-mono text-xs text-runway tracking-wide">STEP 3</p>
          <span className="text-[10px] bg-runway/10 text-runway font-mono px-2 py-0.5 rounded font-semibold">
            Predictive ML & XAI Attribution
          </span>
        </div>
        <h2 className="font-display text-3xl mt-1 mb-2">Skill Gaps & Placement Probability</h2>
        <p className="text-ink/60">
          Ranked by algorithmic impact — recruitment weight × gap magnitude. The predictive machine learning model calculates your campus selection probability with full <strong>Explainable AI (XAI)</strong> transparency.
        </p>
      </div>

      {/* Top Cards: Readiness + ML Probability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rule-based Readiness Gauge */}
        <div className="bg-white border border-line rounded p-6 flex items-center gap-6 shadow-sm">
          <ReadinessGauge score={readinessScore} />
          <div>
            <span className="text-xs font-mono uppercase tracking-wide text-ink/40">Readiness Score</span>
            <p className="font-display text-3xl font-bold mt-0.5 text-ink">{readinessScore}/100</p>
            <p className="text-xs text-ink/60 mt-1">
              Composite index blending skill coverage ({gapResult.coveragePercent}%), quiz accuracy ({quizAvg}%), and roadmap progress ({progressCompletion}%).
            </p>
          </div>
        </div>

        {/* Calibrated ML Placement Probability Card */}
        <div className="bg-white border border-line rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-wide text-runway font-bold">
                ML Placement Model
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded font-semibold"
                style={{
                  color: placementPrediction.tierColor,
                  background: `${placementPrediction.tierColor}18`,
                }}
              >
                {placementPrediction.tier}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="font-display text-4xl font-bold" style={{ color: placementPrediction.tierColor }}>
                {placementPrediction.probabilityPercent}%
              </p>
              <span className="text-xs text-ink/50">estimated offer probability</span>
            </div>
          </div>
          <div className="border-t border-line/60 pt-3 mt-3">
            <p className="text-xs text-ink/60">
              Calibrated Logistic Regression model based on recruitment benchmarks. Baseline campus candidate average is {placementPrediction.baselinePercent}%.
            </p>
          </div>
        </div>
      </div>

      {/* Explainable AI (XAI) Feature Attribution Section */}
      <div className="bg-white border border-line rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-ink text-amber px-1.5 py-0.5 rounded font-mono font-bold">XAI</span>
            <h3 className="font-display text-lg font-bold">Explainable AI (SHAP-style Feature Impact)</h3>
          </div>
          <span className="text-xs text-ink/40 font-mono">Marginal impact on probability</span>
        </div>
        <p className="text-xs text-ink/60 mb-5">
          Why did the ML model estimate {placementPrediction.probabilityPercent}%? Below is the mathematical breakdown of features driving your probability up (+) or pulling it down (-).
        </p>

        <div className="space-y-3">
          {placementPrediction.attributions.map((attr) => {
            const isPositive = attr.impact >= 0;
            const barWidth = Math.min(100, Math.abs(attr.impact) * 2.5);

            return (
              <div key={attr.feature} className="bg-paper/50 border border-line/60 rounded p-3">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-ink/80">{attr.feature} ({attr.val})</span>
                  <span
                    className={`font-mono font-bold ${
                      isPositive ? 'text-runway' : 'text-rust'
                    }`}
                  >
                    {isPositive ? `+${attr.impact}% boost` : `${attr.impact}% penalty`}
                  </span>
                </div>
                <div className="w-full bg-line/40 h-2 rounded overflow-hidden flex">
                  {isPositive ? (
                    <div
                      className="bg-runway h-full rounded transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    />
                  ) : (
                    <div
                      className="bg-rust h-full rounded transition-all duration-300 ml-auto"
                      style={{ width: `${barWidth}%` }}
                    />
                  )}
                </div>
                <p className="text-[11px] text-ink/50 mt-1">{attr.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator */}
      {whatIfResult && (
        <div className="bg-paper border border-line rounded p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-runway text-white px-2 py-0.5 rounded font-mono font-bold">SIMULATION</span>
              <h3 className="font-display text-lg font-bold">Interactive "What-If" Sensitivity Simulator</h3>
            </div>
            <span className="text-xs text-ink/50 font-mono">ROI Optimization</span>
          </div>
          <p className="text-xs text-ink/70 mb-4">
            See how targeted effort in a specific competency shifts your statistical placement probability.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-ink/70">If I improve:</span>
            <select
              value={selectedSkillForSim?.skill}
              onChange={(e) => setSimulatedSkill(e.target.value)}
              className="bg-white border border-line rounded px-3 py-1.5 text-xs font-medium outline-none focus:border-runway"
            >
              {gapResult.gaps.map((g) => (
                <option key={g.skill} value={g.skill}>
                  {g.skill} ({g.current}/70)
                </option>
              ))}
            </select>
            <span className="text-xs font-semibold text-ink/70">to 85% placement-ready bar...</span>
          </div>

          <div className="bg-white border border-line rounded p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink/50">Current Probability → Projected Probability</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl text-ink/60">{whatIfResult.currentProbability}%</span>
                <span className="text-ink/40 font-mono">→</span>
                <span className="font-display text-2xl font-bold text-runway">
                  {whatIfResult.projectedProbability}%
                </span>
                <span className="font-mono text-xs bg-runway/10 text-runway px-2 py-0.5 rounded font-bold">
                  +{whatIfResult.gain}% Marginal Gain
                </span>
              </div>
            </div>
            <p className="text-xs text-ink/60 max-w-xs text-right">
              Closing this gap yields the highest statistical return for your target role.
            </p>
          </div>
        </div>
      )}

      {/* Horizontal Bar Chart of Skill Shortfalls */}
      <div className="bg-white border border-line rounded p-6 shadow-sm">
        <h3 className="font-display text-lg font-bold mb-1">Competency Proficiency Bar Chart</h3>
        <p className="text-xs text-ink/50 mb-4">Target threshold is 70% placement-ready.</p>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid stroke="#DDD5C2" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="current" radius={[0, 3, 3, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLOR[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranked Gap List */}
      <div className="space-y-2">
        <h3 className="font-display text-lg font-bold mb-2">Priority Ranked Action List</h3>
        {gapResult.gaps.map((g) => (
          <div
            key={g.skill}
            className="flex items-center justify-between bg-white border border-line rounded px-4 py-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLOR[g.status] }} />
              <div>
                <span className="font-medium text-sm text-ink">{g.skill}</span>
                <span className="text-[11px] text-ink/40 ml-2">Weight: {g.weight}%</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink/50">
              <span className="font-mono">{g.current}/{g.required}</span>
              <span className="font-mono uppercase text-[11px] font-semibold" style={{ color: STATUS_COLOR[g.status] }}>
                {STATUS_LABEL[g.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Row */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setStep('interview')}
          className="bg-paper border border-line hover:border-runway text-runway px-5 py-3 rounded text-xs font-semibold flex items-center gap-2"
        >
          <span>🎙️</span> Practice AI Mock Interview Round
        </button>
        <button
          onClick={() => setStep('plan')}
          className="bg-ink text-white px-6 py-3 rounded hover:bg-ink/90 text-xs font-semibold"
        >
          Generate AI Weekly Plan →
        </button>
      </div>
    </div>
  );
}
