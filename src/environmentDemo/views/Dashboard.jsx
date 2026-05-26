import React from 'react';
import { AlertTriangle, Ticket } from 'lucide-react';
import { Card, KpiCard, MultiSeriesArea, SeverityBadge, StatusBadge, ViewHeader } from '../shared';
import { TREND_14D } from '../data';

export default function DashboardView({ onIncidentClick }) {
  return (
    <div>
      <ViewHeader title="Security Overview" />

      <Card data-tour="active-banner" className="p-4 mb-6 bg-gradient-to-r from-red-900/20 to-slate-900 border-red-900/40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-300">6 Active Incidents</div>
            <div className="text-xs text-slate-400">2 High · 3 Medium · 1 Low · oldest 2h ago</div>
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold text-red-300 border border-red-500/40 bg-red-500/10 rounded hover:bg-red-500/20">
            View all →
          </button>
        </div>
      </Card>

      <Card data-tour="tickets-banner" className="p-4 mb-6 bg-gradient-to-r from-blue-900/20 to-slate-900 border-blue-900/40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Ticket className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-blue-300">11 Open Tickets in ConnectWise</div>
            <div className="text-xs text-slate-400">4 awaiting client response · 7 in progress</div>
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold text-blue-300 border border-blue-500/40 bg-blue-500/10 rounded hover:bg-blue-500/20">
            View all →
          </button>
        </div>
      </Card>

      <div data-tour="kpi-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard value="47" label="Total Incidents" sublabel="2 H · 11 M · 19 L · 13 I" />
        <KpiCard value="32" label="Analyst-Investigated" sublabel="Medium + High" valueClass="text-blue-400" />
        <KpiCard value="12m" label="Median Time to Triage" sublabel="All severities" valueClass="text-green-400" />
        <KpiCard value="8m" label="Human MTTT" sublabel="Med+High only" valueClass="text-green-400" />
        <KpiCard value="3h 4m" label="Human MTTR" sublabel="Median Time to Resolve" valueClass="text-green-400" />
        <KpiCard value="96%" label="SLA Compliance" sublabel="1hr target (Med+High)" valueClass="text-green-400" />
        <KpiCard value="14" label="True Positives" sublabel="Confirmed threats" valueClass="text-cyan-400" />
        <KpiCard value="22%" label="Benign/FP Rate" sublabel="Of classified incidents" valueClass="text-green-400" />
      </div>

      <Card data-tour="alert-trends" className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Alert Trends</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daily alert volume by severity · last 14 days</p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-red-500" /> High</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500" /> Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-yellow-500" /> Low</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500" /> Info</span>
          </div>
        </div>
        <MultiSeriesArea data={TREND_14D} height={140} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card data-tour="top-rules" className="p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Detection Rules</h3>
          <div className="space-y-2.5">
            {[
              { rule: 'Anonymous IP address sign-in',                    count: 14, pct: 100 },
              { rule: 'Possible AiTM phishing',                          count: 11, pct: 78  },
              { rule: 'Unusual mass file deletion',                      count: 8,  pct: 57  },
              { rule: 'Defender — credential dumping (LSASS access)',    count: 6,  pct: 43  },
              { rule: 'Impossible travel for user',                      count: 5,  pct: 35  },
              { rule: 'New global admin role assignment',                count: 4,  pct: 28  },
              { rule: 'Defender — uncommon process from email client',   count: 3,  pct: 21  },
            ].map((r) => (
              <div key={r.rule}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 truncate pr-2">{r.rule}</span>
                  <span className="text-slate-400 font-mono tabular-nums">{r.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card data-tour="data-sources" className="p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Data Source Health</h3>
          <div className="space-y-2.5">
            {[
              { src: 'Microsoft 365 Defender', gb: 142.6, pct: 100 },
              { src: 'Azure Activity',          gb: 84.1,  pct: 59  },
              { src: 'Entra ID Sign-ins',       gb: 68.3,  pct: 48  },
              { src: 'Defender for Endpoint',   gb: 51.4,  pct: 36  },
              { src: 'Office 365',              gb: 38.7,  pct: 27  },
              { src: 'Azure AD Audit',          gb: 22.9,  pct: 16  },
              { src: 'Threat Intelligence',     gb: 4.2,   pct: 3   },
            ].map((d) => (
              <div key={d.src}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{d.src}</span>
                  <span className="text-slate-400 font-mono tabular-nums">{d.gb} GB</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card data-tour="recent-incidents" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Recent Incidents</h3>
          <span className="text-xs text-slate-500">Last 10</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="text-left px-2 py-1.5 font-medium">#</th>
                <th className="text-left px-2 py-1.5 font-medium">Severity</th>
                <th className="text-left px-2 py-1.5 font-medium">Title</th>
                <th className="text-left px-2 py-1.5 font-medium">Status</th>
                <th className="text-left px-2 py-1.5 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {[
                { num: 'INC-2847', title: 'Suspicious sign-in from anonymizing proxy',         sev: 'High',    status: 'Active', age: '2h ago' },
                { num: 'INC-2846', title: 'Possible AiTM phishing — sarah.chen@acme.com',      sev: 'High',    status: 'Active', age: '3h ago' },
                { num: 'INC-2845', title: 'Mass file deletion on FILE-SRV-01',                 sev: 'Medium',  status: 'New',    age: '5h ago' },
                { num: 'INC-2844', title: 'Defender uncommon process — powershell.exe child',  sev: 'Low',     status: 'Closed', age: '8h ago' },
                { num: 'INC-2843', title: 'New global admin role assignment',                  sev: 'High',    status: 'Closed', age: '1d ago' },
                { num: 'INC-2842', title: 'Impossible travel — liam.park@acme.com',            sev: 'Medium',  status: 'Closed', age: '1d ago' },
              ].map((r) => (
                <tr key={r.num} className="border-t border-slate-800/50 hover:bg-slate-800/40 cursor-pointer" onClick={() => r.num === 'INC-2847' && onIncidentClick()}>
                  <td className="px-2 py-2 text-blue-400 font-mono">{r.num}</td>
                  <td className="px-2 py-2"><SeverityBadge severity={r.sev} /></td>
                  <td className="px-2 py-2 text-slate-300 truncate max-w-md">{r.title}</td>
                  <td className="px-2 py-2"><StatusBadge status={r.status} /></td>
                  <td className="px-2 py-2 text-slate-500">{r.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
