import React from 'react';

/* Visual atoms shared across all demo views.
   Pure presentation — no business logic. */

export const TONE = {
  blue:    { bgSoft: 'bg-blue-500/10',    text: 'text-blue-400',    text300: 'text-blue-300',    border: 'border-blue-500/20' },
  rose:    { bgSoft: 'bg-rose-500/10',    text: 'text-rose-400',    text300: 'text-rose-300',    border: 'border-rose-500/20' },
  red:     { bgSoft: 'bg-red-900/30',     text: 'text-red-400',     text300: 'text-red-300',     border: 'border-red-800' },
  orange:  { bgSoft: 'bg-orange-900/30',  text: 'text-orange-400',  text300: 'text-orange-300',  border: 'border-orange-800' },
  yellow:  { bgSoft: 'bg-yellow-900/30',  text: 'text-yellow-400',  text300: 'text-yellow-300',  border: 'border-yellow-800' },
  amber:   { bgSoft: 'bg-amber-500/10',   text: 'text-amber-400',   text300: 'text-amber-300',   border: 'border-amber-500/20' },
  emerald: { bgSoft: 'bg-emerald-500/10', text: 'text-emerald-400', text300: 'text-emerald-300', border: 'border-emerald-500/20' },
  green:   { bgSoft: 'bg-green-900/30',   text: 'text-green-400',   text300: 'text-green-300',   border: 'border-green-800' },
  violet:  { bgSoft: 'bg-violet-500/10',  text: 'text-violet-400',  text300: 'text-violet-300',  border: 'border-violet-500/20' },
  purple:  { bgSoft: 'bg-purple-500/10',  text: 'text-purple-400',  text300: 'text-purple-300',  border: 'border-purple-500/20' },
  cyan:    { bgSoft: 'bg-cyan-500/10',    text: 'text-cyan-400',    text300: 'text-cyan-300',    border: 'border-cyan-500/20' },
  slate:   { bgSoft: 'bg-slate-500/10',   text: 'text-slate-400',   text300: 'text-slate-300',   border: 'border-slate-700' },
};

const SEVERITY_BADGE_CLS = {
  High:          'bg-red-900/30 text-red-400',
  Medium:        'bg-orange-900/30 text-orange-400',
  Low:           'bg-yellow-900/30 text-yellow-400',
  Informational: 'bg-blue-900/30 text-blue-400',
};

export function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${SEVERITY_BADGE_CLS[severity] || 'text-slate-400'}`}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Active: 'bg-red-900/30 text-red-400',
    New:    'bg-yellow-900/30 text-yellow-400',
    Closed: 'bg-green-900/30 text-green-400',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${map[status] || 'text-slate-400'}`}>
      {status}
    </span>
  );
}

export function ClassificationBadge({ classification }) {
  const map = {
    'TruePositive':    { cls: 'bg-rose-900/30 text-rose-400',   label: 'True Positive' },
    'BenignPositive':  { cls: 'bg-slate-800 text-slate-400',    label: 'Benign' },
    'FalsePositive':   { cls: 'bg-slate-800 text-slate-400',    label: 'False Positive' },
    'Undetermined':    { cls: 'bg-slate-800/60 text-slate-500', label: 'Undetermined' },
  };
  const c = map[classification] || map.Undetermined;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${c.cls}`}>
      {c.label}
    </span>
  );
}

// Page header used on every view — mirrors the real OverviewDashboard / IdentityHygiene header pattern
export function ViewHeader({ title, subtitle = 'Acme Corp' }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
          Refresh
        </button>
        <span className="text-xs text-slate-500 ml-1">Updated 2m ago</span>
      </div>
    </div>
  );
}

// GlassCard-equivalent — the portal's standard card surface
export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function KpiCard({ value, label, sublabel, valueClass = 'text-white' }) {
  return (
    <Card className="p-4">
      <div className={`text-2xl font-bold tabular-nums ${valueClass}`}>{value}</div>
      <div className="text-sm font-medium text-slate-400 mt-1">{label}</div>
      {sublabel && <div className="text-xs text-slate-500 mt-0.5">{sublabel}</div>}
    </Card>
  );
}

export function ProgressRing({ value, size = 64, strokeWidth = 5, color = '#10b981', suffix = '%' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color }}>
        {value}{suffix}
      </div>
    </div>
  );
}

// Stacked area chart for High/Medium/Low/Informational over N days
export function MultiSeriesArea({ data, height = 120 }) {
  const days = data.length;
  const maxStack = Math.max(...data.map((d) => d.high + d.medium + d.low + d.info));
  const point = (i, v) => `${(i / (days - 1)) * 100},${100 - (v / maxStack) * 100}`;
  const infoSeries = data.map((d) => d.info);
  const lowSeries  = data.map((d, i) => infoSeries[i] + d.low);
  const medSeries  = data.map((d, i) => lowSeries[i] + d.medium);
  const highSeries = data.map((d, i) => medSeries[i] + d.high);

  const polyArea = (top, bottom) => {
    const pts = top.map((v, i) => point(i, v)).join(' ');
    const bot = bottom.map((v, i) => point(i, v)).reverse().join(' ');
    return `${pts} ${bot}`;
  };

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polygon points={polyArea(infoSeries, Array(days).fill(0))} fill="#3b82f6" fillOpacity="0.7" />
      <polygon points={polyArea(lowSeries, infoSeries)}            fill="#eab308" fillOpacity="0.7" />
      <polygon points={polyArea(medSeries, lowSeries)}             fill="#f97316" fillOpacity="0.7" />
      <polygon points={polyArea(highSeries, medSeries)}            fill="#ef4444" fillOpacity="0.8" />
    </svg>
  );
}

// Bar chart with horizontal bars — used for ingestion volumes etc.
export function HBarChart({ data, height = 200, valueKey = 'value', labelKey = 'label', formatValue = (v) => v, colorClass = 'bg-blue-500' }) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div style={{ height }} className="space-y-2 overflow-auto">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 truncate pr-2">{d[labelKey]}</span>
            <span className="text-slate-400 font-mono tabular-nums">{formatValue(d[valueKey])}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className={`h-full ${colorClass}`} style={{ width: `${(d[valueKey] / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
