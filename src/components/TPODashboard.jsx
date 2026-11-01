import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ROLES, SEED_BATCH } from '../data/mockData.js';
import { useApp } from '../context/AppContext.jsx';
import { clusterBatchStudents } from '../utils/aiPredictiveModel.js';

function riskColor(readiness) {
  if (readiness < 45) return '#B4532A';
  if (readiness < 70) return '#D9A441';
  return '#2F6F6F';
}

export default function TPODashboard() {
  const { state, role, readinessScore } = useApp();
  const [roleFilter, setRoleFilter] = useState('all');

  // Merge seed batch with active demo student
  const batch = useMemo(() => {
    const rows = [...SEED_BATCH];
    if (state.student.name && role) {
      rows.push({
        id: 'live',
        name: `${state.student.name} (Active Session)`,
        roleId: role.id,
        readiness: readinessScore,
      });
    }
    return rows;
  }, [state.student.name, role, readinessScore]);

  const filtered = roleFilter === 'all' ? batch : batch.filter((s) => s.roleId === roleFilter);
  const avgReadiness = filtered.length
    ? Math.round(filtered.reduce((a, b) => a + b.readiness, 0) / filtered.length)
    : 0;
  const highRisk = filtered.filter((s) => s.readiness < 45);

  const roleAverages = ROLES.map((r) => {
    const rows = batch.filter((s) => s.roleId === r.id);
    const avg = rows.length ? Math.round(rows.reduce((a, b) => a + b.readiness, 0) / rows.length) : 0;
    return { name: r.name.split(' ').slice(0, 2).join(' '), avg };
  });

  // AI Unsupervised Batch Cohort Clustering
  const clusters = useMemo(() => clusterBatchStudents(filtered), [filtered]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-mono text-xs text-runway tracking-wide">TPO & COUNSELLOR INTELLIGENCE</p>
          <span className="text-[10px] bg-runway/10 text-runway font-mono px-2 py-0.5 rounded font-semibold">
            Cohort Clustering & Risk Forecaster
          </span>
        </div>
        <h2 className="font-display text-3xl mt-1 mb-2">Batch Placement Readiness & AI Cohorts</h2>
        <p className="text-ink/60">
          Institutional analytics and algorithmic clustering across student cohorts — identifying targeted interventions before campus recruitment drives commence.
        </p>
      </div>

      {/* Role Filter Buttons */}
      <div className="flex gap-2">
        {['all', ...ROLES.map((r) => r.id)].map((id) => (
          <button
            key={id}
            onClick={() => setRoleFilter(id)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              roleFilter === id
                ? 'border-runway bg-runway/10 text-runway font-medium'
                : 'border-line bg-white text-ink/60 hover:border-ink/30'
            }`}
          >
            {id === 'all' ? 'All recruitment roles' : ROLES.find((r) => r.id === id).name}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card label="Total Candidates Tracked" value={filtered.length} />
        <Card label="Batch Mean Readiness" value={`${avgReadiness}%`} />
        <Card label="At-Risk Candidates (< 45%)" value={highRisk.length} accent={highRisk.length > 0} />
      </div>

      {/* AI Cohort Clusters Panel */}
      <div className="bg-white border border-line rounded p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-ink text-amber px-1.5 py-0.5 rounded font-mono font-bold">AI CLUSTERING</span>
            <h3 className="font-display text-lg font-bold">Machine Learning Cohort Segmentation</h3>
          </div>
          <span className="text-xs text-ink/40 font-mono">Unsupervised K-Means clustering</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusters.map((c) => (
            <div key={c.name} className="border border-line rounded p-4 bg-paper/30">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-xs text-ink" style={{ color: c.color }}>
                  {c.name}
                </span>
                <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-line font-bold">
                  {c.students.length} students
                </span>
              </div>
              <p className="text-[11px] text-ink/60 mb-2">{c.description}</p>
              <div className="bg-white p-2.5 rounded border border-line text-[11px] text-ink/80">
                <strong className="text-ink font-semibold">AI Recommended Intervention:</strong> {c.recommendedIntervention}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Average by Role Chart */}
      <div className="bg-white border border-line rounded p-6 shadow-sm" style={{ height: 230 }}>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50 mb-3">Mean Readiness Benchmark by Role</p>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={roleAverages}>
            <CartesianGrid stroke="#DDD5C2" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="avg" radius={[3, 3, 0, 0]}>
              {roleAverages.map((r, i) => (
                <Cell key={i} fill="#2F6F6F" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Candidate Table */}
      <div className="bg-white border border-line rounded overflow-hidden shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-ink/50 border-b border-line bg-paper/50">
              <th className="px-4 py-3 font-semibold uppercase tracking-wide">Candidate</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide">Target Track</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide">Readiness</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .sort((a, b) => a.readiness - b.readiness)
              .map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0 hover:bg-paper/20">
                  <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
                  <td className="px-4 py-3 text-ink/60">{ROLES.find((r) => r.id === s.roleId)?.name}</td>
                  <td className="px-4 py-3 font-mono font-bold">{s.readiness}%</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-mono font-bold"
                      style={{ color: riskColor(s.readiness), background: `${riskColor(s.readiness)}18` }}
                    >
                      {s.readiness < 45 ? 'NEEDS SUPPORT' : s.readiness < 70 ? 'ON TRACK' : 'READY'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ label, value, accent }) {
  return (
    <div className={`bg-white border rounded p-4 shadow-sm ${accent ? 'border-rust' : 'border-line'}`}>
      <p className="text-[11px] text-ink/50 mb-1">{label}</p>
      <p className={`font-display text-2xl font-bold ${accent ? 'text-rust' : 'text-ink'}`}>{value}</p>
    </div>
  );
}
