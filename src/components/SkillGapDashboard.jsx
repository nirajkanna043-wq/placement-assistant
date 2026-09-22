import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import ReadinessGauge from './ReadinessGauge.jsx';

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
  const { role, gapResult, readinessScore, setStep } = useApp();

  if (!role) {
    return <p className="text-ink/60">Pick a target role first, on the Profile & Role step.</p>;
  }

  const chartData = gapResult.gaps.map((g) => ({
    name: g.skill.length > 18 ? g.skill.slice(0, 16) + '…' : g.skill,
    current: g.current,
    status: g.status,
  }));

  return (
    <div className="max-w-4xl">
      <p className="font-mono text-xs text-runway tracking-wide">STEP 3</p>
      <h2 className="font-display text-3xl mt-1 mb-2">Your skill gaps for {role.name}</h2>
      <p className="text-ink/60 mb-8">
        Ranked by impact — weight of the skill in this role × the size of the gap — so the top of
        this list is where effort pays off fastest.
      </p>

      <div className="grid grid-cols-[auto_1fr] gap-8 items-start mb-8 bg-white border border-line rounded p-6">
        <ReadinessGauge score={readinessScore} />
        <div>
          <p className="text-sm text-ink/50">Skill coverage</p>
          <p className="font-display text-2xl mb-3">{gapResult.coveragePercent}%</p>
          <div className="track-rule mb-3" />
          <p className="text-sm text-ink/60">
            Readiness combines skill coverage (50%), quiz performance (25%) and plan completion
            (25%) into one interpretable score — not a black box.
          </p>
        </div>
      </div>

      <div className="bg-white border border-line rounded p-6 mb-6" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid stroke="#DDD5C2" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="current" radius={[0, 3, 3, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLOR[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mb-8">
        {gapResult.gaps.map((g) => (
          <div key={g.skill} className="flex items-center justify-between bg-white border border-line rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLOR[g.status] }} />
              <span className="font-medium text-sm">{g.skill}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink/50">
              <span>{g.current}/{g.required}</span>
              <span className="font-mono uppercase" style={{ color: STATUS_COLOR[g.status] }}>
                {STATUS_LABEL[g.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setStep('plan')} className="bg-ink text-white px-6 py-3 rounded hover:bg-ink/90">
        Generate my weekly plan →
      </button>
    </div>
  );
}
