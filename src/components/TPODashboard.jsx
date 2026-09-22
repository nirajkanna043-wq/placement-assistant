import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ROLES, SEED_BATCH } from '../data/mockData.js';
import { useApp } from '../context/AppContext.jsx';

function riskColor(readiness) {
  if (readiness < 45) return '#B4532A';
  if (readiness < 70) return '#D9A441';
  return '#2F6F6F';
}

export default function TPODashboard() {
  const { state, role, readinessScore } = useApp();
  const [roleFilter, setRoleFilter] = useState('all');

  // Merge the seed batch with the live student profile so the dashboard
  // reflects data actually entered in the Student view during this demo.
  const batch = useMemo(() => {
    const rows = [...SEED_BATCH];
    if (state.student.name && role) {
      rows.push({ id: 'live', name: `${state.student.name} (you)`, roleId: role.id, readiness: readinessScore });
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

  return (
    <div className="max-w-4xl">
      <p className="font-mono text-xs text-runway tracking-wide">TPO / COUNSELLOR VIEW</p>
      <h2 className="font-display text-3xl mt-1 mb-2">Batch readiness overview</h2>
      <p className="text-ink/60 mb-8">
        A scalable view across the whole batch — surfacing who needs attention before students
        fall behind, instead of relying on one-on-one check-ins alone.
      </p>

      <div className="flex gap-3 mb-6">
        {['all', ...ROLES.map((r) => r.id)].map((id) => (
          <button
            key={id}
            onClick={() => setRoleFilter(id)}
            className={`text-sm px-3 py-1.5 rounded border ${
              roleFilter === id ? 'border-runway bg-runway/5 text-runway' : 'border-line text-ink/60'
            }`}
          >
            {id === 'all' ? 'All roles' : ROLES.find((r) => r.id === id).name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card label="Students shown" value={filtered.length} />
        <Card label="Average readiness" value={`${avgReadiness}%`} />
        <Card label="High-risk (< 45%)" value={highRisk.length} accent={highRisk.length > 0} />
      </div>

      <div className="bg-white border border-line rounded p-6 mb-6" style={{ height: 220 }}>
        <p className="text-sm font-medium mb-3">Average readiness by role</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={roleAverages}>
            <CartesianGrid stroke="#DDD5C2" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="avg" radius={[3, 3, 0, 0]}>
              {roleAverages.map((r, i) => (
                <Cell key={i} fill="#2F6F6F" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-line rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink/50 border-b border-line">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Target role</th>
              <th className="px-4 py-3">Readiness</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .sort((a, b) => a.readiness - b.readiness)
              .map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 text-ink/60">{ROLES.find((r) => r.id === s.roleId)?.name}</td>
                  <td className="px-4 py-3 font-mono">{s.readiness}%</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded font-mono"
                      style={{ color: riskColor(s.readiness), background: `${riskColor(s.readiness)}1A` }}
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
    <div className={`bg-white border rounded p-4 ${accent ? 'border-rust' : 'border-line'}`}>
      <p className="text-xs text-ink/50 mb-1">{label}</p>
      <p className={`font-display text-2xl ${accent ? 'text-rust' : ''}`}>{value}</p>
    </div>
  );
}
