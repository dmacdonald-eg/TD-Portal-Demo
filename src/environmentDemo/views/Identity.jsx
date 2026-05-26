import React from 'react';
import { User, Shield } from 'lucide-react';
import { Card, KpiCard, MultiSeriesArea, ProgressRing, SeverityBadge, ViewHeader } from '../shared';
import { TREND_14D } from '../data';

export default function IdentityView() {
  return (
    <div>
      <ViewHeader title="Identity Hygiene" />

      <div data-tour="identity-kpis" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard value="904" label="Active Users" sublabel="Last 30 days" />
        <KpiCard value="7" label="Risky Users" sublabel="2 High · 5 Medium" valueClass="text-rose-400" />
        <KpiCard value="142" label="Failed Sign-ins" sublabel="-14% vs last week" valueClass="text-amber-400" />
        <KpiCard value="12" label="Stale Accounts" sublabel=">90 days inactive" valueClass="text-slate-400" />
      </div>

      <Card data-tour="risky-users" className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Risky Users</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800">
              <th className="text-left px-2 py-1.5 font-medium">User</th>
              <th className="text-left px-2 py-1.5 font-medium">Risk Level</th>
              <th className="text-left px-2 py-1.5 font-medium">Risk State</th>
              <th className="text-left px-2 py-1.5 font-medium">Detection</th>
              <th className="text-left px-2 py-1.5 font-medium">MFA</th>
              <th className="text-left px-2 py-1.5 font-medium">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {[
              { user: 'sarah.chen@acme.com',       risk: 'High',   state: 'At Risk',        det: 'Anonymous IP address', mfa: 'None', age: '2h ago' },
              { user: 'mike.davis@acme.com',       risk: 'High',   state: 'At Risk',        det: 'Impossible travel',    mfa: 'App',  age: '5h ago' },
              { user: 'liam.park@acme.com',        risk: 'Medium', state: 'At Risk',        det: 'Unfamiliar location',  mfa: 'App',  age: '1d ago' },
              { user: 'jenna.k@acme.com',          risk: 'Medium', state: 'At Risk',        det: 'Atypical travel',      mfa: 'SMS',  age: '1d ago' },
              { user: 'svc-sync@acme.onmicrosoft', risk: 'Medium', state: 'At Risk',        det: 'Token anomaly',        mfa: 'None', age: '2d ago' },
              { user: 'hr@acme.com',               risk: 'Low',    state: 'Confirmed Safe', det: 'Password spray',       mfa: 'App',  age: '3d ago' },
              { user: 'cfo@acme.com',              risk: 'Low',    state: 'Confirmed Safe', det: 'Leaked credential',    mfa: 'App',  age: '5d ago' },
            ].map((u) => (
              <tr key={u.user} className="border-t border-slate-800/50 hover:bg-slate-800/40">
                <td className="px-2 py-2 text-slate-300 font-mono">{u.user}</td>
                <td className="px-2 py-2"><SeverityBadge severity={u.risk} /></td>
                <td className="px-2 py-2 text-slate-400">{u.state}</td>
                <td className="px-2 py-2 text-slate-400">{u.det}</td>
                <td className="px-2 py-2">
                  {u.mfa === 'None' ? <span className="text-[10px] px-1 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">NO MFA</span> : <span className="text-slate-400">{u.mfa}</span>}
                </td>
                <td className="px-2 py-2 text-slate-500">{u.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Identity Risk Trend — Last 14 Days</h3>
        <MultiSeriesArea data={TREND_14D} height={120} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card data-tour="ca-policies" className="p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Conditional Access Policies</h3>
          <div className="space-y-2">
            {[
              { name: 'Require MFA for all admins',                state: 'Enabled',     applies: 12,  blocks: 0  },
              { name: 'Block legacy auth',                          state: 'Enabled',     applies: 904, blocks: 47 },
              { name: 'Block sign-ins from anonymous IPs',          state: 'Report-only', applies: 904, blocks: 18 },
              { name: 'Require compliant device',                   state: 'Enabled',     applies: 783, blocks: 12 },
              { name: 'High-risk users require password reset',     state: 'Enabled',     applies: 7,   blocks: 2  },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2 py-2 border-b border-slate-800 last:border-b-0">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="flex-1 text-xs text-slate-300">{p.name}</span>
                <span className="text-[10px] text-slate-500">{p.applies} users · {p.blocks} blocks</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.state === 'Enabled' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                  {p.state}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card data-tour="mfa-coverage" className="p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">MFA Coverage</h3>
          <div className="flex items-center gap-5">
            <ProgressRing value={94} size={100} strokeWidth={8} color="#10b981" suffix="%" />
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Enforced</span><span className="text-emerald-300 font-mono">847</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Registered</span><span className="text-amber-300 font-mono">38</span></div>
              <div className="flex justify-between"><span className="text-slate-400">No MFA</span><span className="text-rose-300 font-mono">19</span></div>
              <div className="pt-2 mt-2 border-t border-slate-800">
                <div className="text-[10px] text-slate-500">SFA apps detected: 3 (legacy)</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card data-tour="identity-geo" className="p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Sign-in Locations</h3>
        <div className="relative h-32 rounded bg-slate-950 overflow-hidden">
          <svg viewBox="0 0 400 100" className="w-full h-full">
            {Array.from({ length: 80 }).map((_, i) => {
              const x = ((i * 37) % 400);
              const y = (Math.sin(i * 0.7) * 30) + 50;
              return <circle key={i} cx={x} cy={y} r="0.8" fill="#1e293b" />;
            })}
            {[
              { x: 90,  y: 35, r: 4, c: '#10b981' },
              { x: 95,  y: 42, r: 3, c: '#10b981' },
              { x: 195, y: 30, r: 5, c: '#10b981' },
              { x: 280, y: 50, r: 3, c: '#10b981' },
              { x: 320, y: 60, r: 2, c: '#10b981' },
              { x: 200, y: 25, r: 4, c: '#f43f5e' },
              { x: 175, y: 60, r: 3, c: '#f59e0b' },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={p.r * 2} fill={p.c} opacity="0.2" />
                <circle cx={p.x} cy={p.y} r={p.r} fill={p.c} />
              </g>
            ))}
          </svg>
          <div className="absolute top-1.5 right-2 flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>Normal</span>
            <span className="flex items-center gap-1 text-amber-400"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"/>Atypical</span>
            <span className="flex items-center gap-1 text-rose-400"><div className="w-1.5 h-1.5 rounded-full bg-rose-400"/>Anomalous</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
