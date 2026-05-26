import React, { useState } from 'react';
import {
  Search, ArrowUpDown, Eye, Download, ArrowUpRight, Sparkles, CheckCircle2,
  Clock, MoreHorizontal,
} from 'lucide-react';
import { Card, ProgressRing, ViewHeader } from '../shared';

const REPORTS_SUBTABS = [
  { id: 'downloads', label: 'Downloads' },
  { id: 'posture',   label: 'Security Posture' },
];

// Mirror of TYPE_META in src/components/reports/ReportsPage.jsx
const TYPE_META = {
  'identity-risk': {
    label: 'Identity Risk',
    cadence: 'weekly',
    coverGradient: 'from-blue-500/30 via-cyan-500/20 to-blue-600/30',
    coverBorder: 'border-blue-500/30',
    coverText: 'text-blue-100',
    chipBorder: 'border-blue-500/30',
    chipText: 'text-blue-300',
    chipActiveBg: 'bg-blue-500/25',
    accentBorder: 'hover:border-blue-500/40',
    countText: 'text-blue-300',
    dot: 'bg-blue-400',
  },
  vulnerability: {
    label: 'Vulnerability',
    cadence: 'monthly',
    coverGradient: 'from-amber-500/30 via-orange-500/20 to-amber-600/30',
    coverBorder: 'border-amber-500/30',
    coverText: 'text-amber-100',
    chipBorder: 'border-amber-500/30',
    chipText: 'text-amber-300',
    chipActiveBg: 'bg-amber-500/25',
    accentBorder: 'hover:border-amber-500/40',
    countText: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  'secure-score': {
    label: 'Secure Score',
    cadence: 'quarterly',
    coverGradient: 'from-emerald-500/30 via-green-500/20 to-emerald-600/30',
    coverBorder: 'border-emerald-500/30',
    coverText: 'text-emerald-100',
    chipBorder: 'border-emerald-500/30',
    chipText: 'text-emerald-300',
    chipActiveBg: 'bg-emerald-500/25',
    accentBorder: 'hover:border-emerald-500/40',
    countText: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
};

const TYPE_ORDER = ['identity-risk', 'vulnerability', 'secure-score'];

// Synthetic report dataset. Hero is the latest of all = identity-risk week-of-May-19.
const REPORTS = [
  // Identity Risk — weekly
  { type: 'identity-risk', title: 'Week of May 19, 2026',   age: '7 days ago',   size: '1.4 MB', primary: '19', secondary: 'MAY', summary: 'Spike in risky sign-ins from anonymized infrastructure this week — 14 distinct users flagged, all single-event after Conditional Access kicked in. Two users on the leadership team trigger the highest residual risk.' },
  { type: 'identity-risk', title: 'Week of May 12, 2026',   age: '2 weeks ago',  size: '1.4 MB', primary: '12', secondary: 'MAY' },
  { type: 'identity-risk', title: 'Week of May 5, 2026',    age: '3 weeks ago',  size: '1.3 MB', primary: '05', secondary: 'MAY' },
  { type: 'identity-risk', title: 'Week of April 28, 2026', age: '4 weeks ago',  size: '1.3 MB', primary: '28', secondary: 'APR' },
  // Vulnerability — monthly
  { type: 'vulnerability', title: 'April 2026',             age: '3 weeks ago',  size: '2.1 MB', primary: 'APR', secondary: '2026', summary: '47 new vulnerabilities since last report (12 critical, 23 high). Exchange Server CVE-2026-1234 remains the top priority — already added to CISA KEV.' },
  { type: 'vulnerability', title: 'March 2026',             age: '8 weeks ago',  size: '2.0 MB', primary: 'MAR', secondary: '2026' },
  { type: 'vulnerability', title: 'February 2026',          age: '3 months ago', size: '1.9 MB', primary: 'FEB', secondary: '2026' },
  // Secure Score — quarterly
  { type: 'secure-score',  title: 'Q1 2026',                age: '8 weeks ago',  size: '0.9 MB', primary: 'Q1', secondary: '2026', summary: 'Secure Score improved +4 points this quarter to 78%. MFA registration and legacy auth blocks delivered the bulk of the gain. Three quick wins remain — full breakdown in the report.' },
  { type: 'secure-score',  title: 'Q4 2025',                age: '5 months ago', size: '0.9 MB', primary: 'Q4', secondary: '2025' },
];

const HERO = REPORTS[0];

const CADENCE = [
  { type: 'identity-risk', label: 'expected today',  tone: 'text-amber-300', date: 'May 26' },
  { type: 'vulnerability', label: 'in 6 days',       tone: 'text-slate-400', date: 'Jun 1' },
  { type: 'secure-score',  label: 'in 5 weeks',      tone: 'text-slate-400', date: 'Jul 1' },
];

function ReportCover({ type, primary, secondary, size = 'md' }) {
  const meta = TYPE_META[type];
  const dims = size === 'lg' ? 'w-32 h-32 text-5xl' : size === 'sm' ? 'w-12 h-12 text-base' : 'w-16 h-16 text-2xl';
  const secondaryClass = size === 'lg' ? 'text-sm tracking-[0.2em]' : 'text-[9px] tracking-[0.15em]';
  return (
    <div className={`${dims} shrink-0 rounded-xl border ${meta.coverBorder} bg-gradient-to-br ${meta.coverGradient} flex flex-col items-center justify-center font-mono font-bold ${meta.coverText} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/5" />
      <span className="relative leading-none">{primary}</span>
      {secondary && <span className={`relative font-medium opacity-70 mt-1 ${secondaryClass}`}>{secondary}</span>}
    </div>
  );
}

function TypeFilterChip({ type, label, count, active, onClick }) {
  if (type === '') {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-sm font-medium ${
          active
            ? 'bg-slate-100 border-slate-100 text-slate-900'
            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
        }`}
      >
        {label}
        <span className="text-xs font-semibold tabular-nums text-slate-500">{count}</span>
      </button>
    );
  }
  const meta = TYPE_META[type];
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-sm font-medium ${
        active
          ? `${meta.chipActiveBg} ${meta.chipBorder} ${meta.chipText}`
          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
      <span className={`text-xs font-semibold tabular-nums ${active ? meta.chipText : 'text-slate-500'}`}>{count}</span>
    </button>
  );
}

function HeroLatestCard({ report }) {
  const meta = TYPE_META[report.type];
  return (
    <div className={`relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-6 lg:p-8 overflow-hidden ${meta.accentBorder} transition-colors`}>
      <div className={`absolute -top-32 -right-24 w-72 h-72 bg-gradient-to-br ${meta.coverGradient} rounded-full blur-3xl opacity-40 pointer-events-none`} />
      <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
        <ReportCover type={report.type} primary={report.primary} secondary={report.secondary} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-semibold tracking-wider uppercase">
              <Sparkles className="w-3 h-3" /> Latest
            </span>
            <span className={`text-[10px] font-semibold tracking-wider uppercase ${meta.chipText}`}>{meta.label}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{report.title}</h2>
          <p className="text-sm text-slate-400 mt-1.5">Received {report.age} · {report.size} · May 19, 2026</p>

          <div className="mt-4 max-w-2xl">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-300 mt-1 shrink-0" />
              <p className="text-sm leading-relaxed text-slate-200">{report.summary}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-5">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white text-slate-900 rounded-lg hover:bg-slate-100">
              <Download className="w-4 h-4" /> Download
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-800/80 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-700">
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CadenceStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 px-1">
      <div className="inline-flex items-center gap-1.5 text-slate-400">
        <Clock className="w-3.5 h-3.5" />
        <span className="font-medium">Next expected</span>
      </div>
      {CADENCE.map((c) => {
        const meta = TYPE_META[c.type];
        return (
          <div key={c.type} className="inline-flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            <span className="text-slate-300">{meta.label}</span>
            <span className={c.tone}>{c.label}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">{c.date}</span>
          </div>
        );
      })}
    </div>
  );
}

function ReportCard({ report }) {
  const meta = TYPE_META[report.type];
  return (
    <div className={`group relative bg-slate-900 border border-slate-800 rounded-xl p-4 ${meta.accentBorder} hover:-translate-y-0.5 transition-all duration-150 flex flex-col`}>
      <div className="flex items-start gap-4 mb-3">
        <ReportCover type={report.type} primary={report.primary} secondary={report.secondary} size="md" />
        <div className="min-w-0 flex-1 pt-1">
          <h3 className="text-sm font-semibold text-slate-100 leading-tight">{report.title}</h3>
          <p className="text-xs text-slate-500 mt-1.5">{report.age} · {report.size}</p>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {report.summary ? (
        <div className="flex items-start gap-1.5 mb-3 -mt-1">
          <Sparkles className="w-3 h-3 text-blue-300 mt-0.5 shrink-0" />
          <p className="text-xs leading-snug text-slate-300 line-clamp-3">{report.summary}</p>
        </div>
      ) : (
        <button className="inline-flex items-center gap-1.5 self-start mb-3 -mt-1 px-2 py-0.5 text-[11px] text-slate-500 hover:text-blue-300">
          <Sparkles className="w-3 h-3" /> Generate AI summary
        </button>
      )}

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-800/60">
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border text-slate-200 bg-slate-800/60 border-slate-700 hover:bg-slate-700">
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg">
          <Download className="w-3.5 h-3.5" /> Download
        </button>
      </div>
    </div>
  );
}

function ReportsDownloadsView() {
  const [filter, setFilter] = useState('');
  const counts = {
    '': REPORTS.length,
    'identity-risk': REPORTS.filter((r) => r.type === 'identity-risk').length,
    vulnerability:   REPORTS.filter((r) => r.type === 'vulnerability').length,
    'secure-score':  REPORTS.filter((r) => r.type === 'secure-score').length,
  };

  const groups = TYPE_ORDER
    .map((type) => {
      // Exclude the hero report from its group when no filter active
      const reports = REPORTS.filter((r) => r.type === type && (filter || r !== HERO));
      if (filter && filter !== type) return null;
      if (reports.length === 0) return null;
      return { type, meta: TYPE_META[type], reports };
    })
    .filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <TypeFilterChip type=""              label="All Reports"    count={counts['']}              active={filter === ''}              onClick={() => setFilter('')} />
        <TypeFilterChip type="identity-risk"                       count={counts['identity-risk']}  active={filter === 'identity-risk'} onClick={() => setFilter('identity-risk')} />
        <TypeFilterChip type="vulnerability"                       count={counts.vulnerability}     active={filter === 'vulnerability'} onClick={() => setFilter('vulnerability')} />
        <TypeFilterChip type="secure-score"                        count={counts['secure-score']}   active={filter === 'secure-score'}  onClick={() => setFilter('secure-score')} />
      </div>

      {/* Hero — only when no filter */}
      {!filter && <HeroLatestCard report={HERO} />}

      {/* Cadence strip */}
      {!filter && <CadenceStrip />}

      {/* Search + sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            disabled
            placeholder="Search reports…"
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-slate-900/60 border border-slate-800 rounded-lg text-slate-300 hover:text-white">
          <ArrowUpDown className="w-3.5 h-3.5" /> Newest First
        </button>
      </div>

      {/* Grouped sections */}
      <div data-tour="reports-table" className="space-y-8">
        {groups.map((g) => (
          <div key={g.type}>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-lg font-semibold text-slate-200">{g.meta.label}</h2>
              <span className={`text-sm font-medium tabular-nums ${g.meta.countText}`}>{g.reports.length}</span>
              <span className="text-xs text-slate-600">·</span>
              <span className="text-xs text-slate-500 capitalize">{g.meta.cadence} cadence</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {g.reports.map((r, i) => <ReportCard key={i} report={r} />)}
            </div>
          </div>
        ))}
        <div className="text-xs text-slate-600 pt-2">
          {groups.reduce((n, g) => n + g.reports.length, 0) + (!filter ? 1 : 0)} reports
        </div>
      </div>
    </div>
  );
}

function ReportsPostureView() {
  const score = 78;
  const subs = [
    { label: 'Identity',    score: 84, max: 100, color: '#3b82f6' },
    { label: 'Device',      score: 71, max: 100, color: '#06b6d4' },
    { label: 'Application', score: 76, max: 100, color: '#8b5cf6' },
    { label: 'Data',        score: 82, max: 100, color: '#10b981' },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card data-tour="secure-score" className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 self-start">Microsoft Secure Score</h3>
          <ProgressRing value={score} size={140} strokeWidth={11} color="#3b82f6" suffix="" />
          <div className="text-sm text-slate-500 mt-3">out of 100</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2">
            <ArrowUpRight className="w-3 h-3" /> +4 pts this quarter
          </div>
        </Card>

        <Card className="col-span-2 p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Posture Breakdown</h3>
          <div className="space-y-3">
            {subs.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{s.label}</span>
                  <span className="text-slate-300 font-mono tabular-nums">{s.score} / {s.max}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(s.score / s.max) * 100}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span><span className="text-slate-200 font-semibold">3 quick wins</span> available — enable MFA registration policy for +6 pts</span>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Improvement Actions</h3>
        <div className="space-y-2">
          {[
            { action: 'Require MFA for administrative roles',             pts: '+8 pts', effort: 'Low',    cat: 'Identity' },
            { action: 'Enable Defender for Cloud Apps anomaly detection', pts: '+6 pts', effort: 'Low',    cat: 'Application' },
            { action: 'Block legacy authentication',                       pts: '+5 pts', effort: 'Medium', cat: 'Identity' },
            { action: 'Configure DLP for sensitive document types',        pts: '+4 pts', effort: 'High',   cat: 'Data' },
            { action: 'Enable attack surface reduction rules',             pts: '+3 pts', effort: 'Medium', cat: 'Device' },
          ].map((a) => (
            <div key={a.action} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-b-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
              <span className="flex-1 text-xs text-slate-300">{a.action}</span>
              <span className="text-[10px] text-slate-500">{a.cat}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${a.effort === 'Low' ? 'bg-emerald-500/15 text-emerald-300' : a.effort === 'Medium' ? 'bg-amber-500/15 text-amber-300' : 'bg-rose-500/15 text-rose-300'}`}>
                {a.effort}
              </span>
              <span className="text-xs font-mono text-emerald-300 w-16 text-right">{a.pts}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ReportsView({ onTourTargetClick }) {
  const [sub, setSub] = useState('downloads');
  return (
    <div>
      <ViewHeader title={sub === 'downloads' ? 'Reports' : 'Security Posture'} subtitle={sub === 'downloads' ? 'Acme Corp' : undefined} />
      <div className="flex items-center gap-1 border-b border-slate-800 mb-6">
        {REPORTS_SUBTABS.map((s) => (
          <button
            key={s.id}
            data-tour={s.id === 'posture' ? 'reports-posture-tab' : undefined}
            onClick={() => {
              setSub(s.id);
              if (s.id === 'posture') onTourTargetClick?.('reports-posture-tab');
            }}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${sub === s.id ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            {s.label}
            {sub === s.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />}
          </button>
        ))}
      </div>
      {sub === 'downloads' ? <ReportsDownloadsView /> : <ReportsPostureView />}
    </div>
  );
}
