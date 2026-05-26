import React, { useState } from 'react';
import {
  ShieldCheck, Activity, Fingerprint, Monitor, Mail, FileSearch, Radio, Database,
  CheckCircle2, XCircle, AlertTriangle, ChevronDown,
} from 'lucide-react';
import { Card, KpiCard, MultiSeriesArea, ViewHeader } from '../shared';
import { TREND_14D } from '../data';

const HEALTH_TABS = [
  { id: 'overview',   label: 'Overview',   tour: 'health-tab-overview' },
  { id: 'ingestion',  label: 'Ingestion',  tour: 'health-tab-ingestion' },
  { id: 'freshness',  label: 'Freshness',  tour: 'health-tab-freshness' },
  { id: 'connectors', label: 'Connectors', tour: 'health-tab-connectors' },
  { id: 'rules',      label: 'Rule Health',tour: 'health-tab-rules' },
];

function OverviewTab() {
  return (
    <div data-tour="health-overview">
      <Card className="p-4 mb-6 border-emerald-900/40 bg-gradient-to-r from-emerald-900/10 to-slate-900">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-sm font-semibold text-emerald-300">All systems operational</div>
            <div className="text-xs text-slate-400">12 of 12 connectors healthy · last scan 4 min ago</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard value="12" label="Healthy Connectors" sublabel="of 12 total" valueClass="text-green-400" />
        <KpiCard value="142.6 GB" label="Ingestion (24h)" sublabel="-3% vs avg" valueClass="text-blue-400" />
        <KpiCard value="3" label="Stale Tables" sublabel=">24h no data" valueClass="text-yellow-400" />
        <KpiCard value="98.4%" label="Rule Success Rate" sublabel="last 24h" valueClass="text-green-400" />
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Needs Attention</h3>
        <div className="space-y-2">
          {[
            { sev: 'Aging', table: 'AuditLogs',           detail: 'No new data in 34 minutes (expected every 15)' },
            { sev: 'Stale', table: 'ThreatIntelIndicator',detail: 'No new data in 4 hours (expected hourly)' },
            { sev: 'Stale', table: 'NetworkSessions',     detail: 'No new data in 6 hours (expected hourly)' },
          ].map((r) => (
            <div key={r.table} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-b-0">
              <AlertTriangle className={`w-3.5 h-3.5 ${r.sev === 'Stale' ? 'text-orange-400' : 'text-amber-400'}`} />
              <span className="text-xs font-mono text-slate-200">{r.table}</span>
              <span className="text-xs text-slate-400 flex-1">{r.detail}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.sev === 'Stale' ? 'bg-orange-500/15 text-orange-300' : 'bg-amber-500/15 text-amber-300'}`}>{r.sev}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function IngestionTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard value="142.6 GB" label="24h Volume" valueClass="text-blue-400" />
        <KpiCard value="9.4M" label="Events/24h" valueClass="text-cyan-400" />
        <KpiCard value="109 EPS" label="Average EPS" sublabel="Last 24 hours" valueClass="text-emerald-400" />
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Daily Ingestion Volume — Top 8 Tables (14d)</h3>
        <MultiSeriesArea data={TREND_14D} height={140} />
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Tables by Volume (24h)</h3>
        <div className="space-y-2.5">
          {[
            { table: 'DeviceProcessEvents',  gb: 38.4, pct: 100 },
            { table: 'EmailEvents',          gb: 24.8, pct: 65  },
            { table: 'SigninLogs',           gb: 19.7, pct: 51  },
            { table: 'AzureActivity',        gb: 14.2, pct: 37  },
            { table: 'AuditLogs',            gb: 11.6, pct: 30  },
            { table: 'DeviceNetworkEvents',  gb: 9.4,  pct: 24  },
            { table: 'SecurityAlert',        gb: 7.8,  pct: 20  },
            { table: 'OfficeActivity',       gb: 5.2,  pct: 14  },
          ].map((r) => (
            <div key={r.table}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-mono">{r.table}</span>
                <span className="text-slate-400 font-mono tabular-nums">{r.gb} GB</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FreshnessTab() {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Per-Table Data Freshness</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500 border-b border-slate-800">
            <th className="text-left px-2 py-1.5 font-medium">Table</th>
            <th className="text-left px-2 py-1.5 font-medium">Last Event</th>
            <th className="text-left px-2 py-1.5 font-medium">Expected Cadence</th>
            <th className="text-left px-2 py-1.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { table: 'SecurityIncident',     last: '2m ago',   expected: 'Real-time',     state: 'Fresh',    color: 'emerald' },
            { table: 'SigninLogs',           last: '5m ago',   expected: '5 min',         state: 'Fresh',    color: 'emerald' },
            { table: 'DeviceProcessEvents',  last: '3m ago',   expected: 'Real-time',     state: 'Fresh',    color: 'emerald' },
            { table: 'EmailEvents',          last: '8m ago',   expected: '15 min batch',  state: 'Fresh',    color: 'emerald' },
            { table: 'OfficeActivity',       last: '12m ago',  expected: '15 min batch',  state: 'Fresh',    color: 'emerald' },
            { table: 'AzureActivity',        last: '6m ago',   expected: 'Real-time',     state: 'Fresh',    color: 'emerald' },
            { table: 'AuditLogs',            last: '34m ago',  expected: '15 min batch',  state: 'Aging',    color: 'amber' },
            { table: 'ThreatIntelIndicator', last: '4h ago',   expected: 'Hourly',        state: 'Stale',    color: 'orange' },
            { table: 'NetworkSessions',      last: '6h ago',   expected: 'Hourly',        state: 'Stale',    color: 'orange' },
          ].map((r) => {
            const stateCls = r.color === 'emerald' ? 'text-emerald-300 bg-emerald-500/15' : r.color === 'amber' ? 'text-amber-300 bg-amber-500/15' : 'text-orange-300 bg-orange-500/15';
            return (
              <tr key={r.table} className="border-t border-slate-800/50">
                <td className="px-2 py-2 text-slate-300 font-mono">{r.table}</td>
                <td className="px-2 py-2 text-slate-400">{r.last}</td>
                <td className="px-2 py-2 text-slate-500">{r.expected}</td>
                <td className="px-2 py-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${stateCls}`}>{r.state}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function ConnectorsTab() {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Data Connectors</h3>
      <div className="space-y-2">
        {[
          { name: 'Microsoft 365 Defender',       icon: ShieldCheck, events: '4.2M', errors: 0, ok: true },
          { name: 'Azure Activity',                icon: Activity,    events: '1.8M', errors: 0, ok: true },
          { name: 'Entra ID Sign-in Logs',         icon: Fingerprint, events: '892K', errors: 0, ok: true },
          { name: 'Defender for Endpoint',         icon: Monitor,     events: '2.1M', errors: 0, ok: true },
          { name: 'Office 365 / Exchange',         icon: Mail,        events: '687K', errors: 0, ok: true },
          { name: 'Azure AD Audit Logs',           icon: FileSearch,  events: '124K', errors: 2, ok: true },
          { name: 'Defender Threat Intelligence',  icon: Radio,       events: '38K',  errors: 0, ok: true },
          { name: 'Microsoft Defender for Cloud',  icon: ShieldCheck, events: '76K',  errors: 0, ok: true },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.name} className="flex items-center gap-3 py-2.5 border-b border-slate-800 last:border-b-0">
              <Icon className="w-4 h-4 text-emerald-400" />
              <span className="flex-1 text-xs text-slate-300">{c.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">{c.events} events / 24h</span>
              {c.errors > 0 && <span className="text-[10px] text-amber-300">{c.errors} warnings</span>}
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">Healthy</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function RuleHealthTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard value="187" label="Active Rules" valueClass="text-blue-400" />
        <KpiCard value="98.4%" label="Success Rate" sublabel="last 24h" valueClass="text-green-400" />
        <KpiCard value="3" label="Failing Rules" sublabel="needs attention" valueClass="text-amber-400" />
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Failing Rules</h3>
        <div className="space-y-2">
          {[
            { rule: 'Defender — Suspicious LDAP query',           runs: 96,  fails: 4,  err: 'Query timeout (>120s) on large directory' },
            { rule: 'New OAuth grant to suspicious app',          runs: 48,  fails: 2,  err: 'Permission denied: OfficeActivity table' },
            { rule: 'Threat Intel match — file hash',             runs: 24,  fails: 1,  err: 'ThreatIntelIndicator stale (>4h)' },
          ].map((r) => (
            <div key={r.rule} className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-b-0">
              <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-slate-200 font-semibold">{r.rule}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Last run: 12m ago · {r.runs} runs / 24h · {r.fails} failures</div>
                <div className="text-[10px] text-rose-300 mt-1 font-mono">{r.err}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Recently Executed Rules</h3>
        <div className="space-y-1.5">
          {[
            { rule: 'Anonymous IP address sign-in',            success: true,  time: '2m ago' },
            { rule: 'New device registration outside hours',   success: true,  time: '5m ago' },
            { rule: 'Mass file deletion',                       success: true,  time: '8m ago' },
            { rule: 'Defender — credential dumping',           success: true,  time: '12m ago' },
            { rule: 'Suspicious LDAP query',                   success: false, time: '12m ago' },
            { rule: 'New global admin role assignment',        success: true,  time: '15m ago' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-800 last:border-b-0">
              {r.success ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              <span className="flex-1 text-xs text-slate-300">{r.rule}</span>
              <span className="text-[10px] text-slate-500">{r.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function HealthView({ onTourTargetClick }) {
  const [tab, setTab] = useState('overview');
  const handleTabClick = (id, tour) => {
    setTab(id);
    onTourTargetClick?.(tour);
  };
  return (
    <div>
      <ViewHeader title="Sentinel Health" />
      <div className="flex items-center gap-1 border-b border-slate-800 mb-6">
        {HEALTH_TABS.map((t) => (
          <button
            key={t.id}
            data-tour={t.tour}
            onClick={() => handleTabClick(t.id, t.tour)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${tab === t.id ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            {t.label}
            {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />}
          </button>
        ))}
      </div>
      {tab === 'overview'   && <OverviewTab />}
      {tab === 'ingestion'  && <IngestionTab />}
      {tab === 'freshness'  && <FreshnessTab />}
      {tab === 'connectors' && <ConnectorsTab />}
      {tab === 'rules'      && <RuleHealthTab />}
    </div>
  );
}
