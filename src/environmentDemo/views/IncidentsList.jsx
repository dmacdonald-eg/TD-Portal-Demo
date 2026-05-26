import React from 'react';
import { Search, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Card, SeverityBadge, StatusBadge, ClassificationBadge, ViewHeader } from '../shared';
import { INCIDENT_ROWS } from '../data';

export default function IncidentsListView({ onIncidentClick }) {
  return (
    <div>
      <ViewHeader title="Incidents" subtitle="47 total · 6 active · 41 closed" />

      <Card data-tour="incidents-filter" className="p-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-950 flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input disabled placeholder="Search by title or number..." className="bg-transparent text-xs text-slate-300 outline-none flex-1" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800">
            <Filter className="w-3 h-3" /> All Severities <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800">
            <Filter className="w-3 h-3" /> All Statuses <ChevronDown className="w-3 h-3" />
          </button>
          <button className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300">Clear filters</button>
        </div>
      </Card>

      <Card data-tour="incidents-table" className="overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-900">
            <tr className="text-slate-500 border-b border-slate-800">
              {['#', 'Severity', 'Title', 'Status', 'Classification', 'Alerts', 'Ticket', 'Analyst', 'Created'].map((c) => (
                <th key={c} className="text-left px-3 py-2 font-medium">
                  <span className="inline-flex items-center gap-1">{c} <ArrowUpDown className="w-2.5 h-2.5 text-slate-700" /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INCIDENT_ROWS.map((r) => (
              <tr
                key={r.num}
                data-tour={r.num === 'INC-2847' ? 'incident-row-2847' : undefined}
                onClick={() => r.num === 'INC-2847' && onIncidentClick()}
                className="border-t border-slate-800/50 hover:bg-slate-800/40 cursor-pointer"
              >
                <td className="px-3 py-2 text-blue-400 font-mono">{r.num}</td>
                <td className="px-3 py-2"><SeverityBadge severity={r.sev} /></td>
                <td className="px-3 py-2 text-slate-300 truncate max-w-md">{r.title}</td>
                <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                <td className="px-3 py-2"><ClassificationBadge classification={r.cls} /></td>
                <td className="px-3 py-2 text-slate-400 text-center">{r.alerts}</td>
                <td className="px-3 py-2">{r.ticket ? <span className="text-blue-400 font-mono">#{r.ticket}</span> : <span className="text-slate-700">—</span>}</td>
                <td className="px-3 py-2 text-slate-400 font-mono">{r.analyst === 'unassigned' ? <span className="text-slate-600">—</span> : r.analyst}</td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{r.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800 text-xs text-slate-500">
          <span>Showing 1–8 of 47</span>
          <div className="flex items-center gap-2">
            <button disabled className="px-2 py-1 text-slate-700">← Previous</button>
            <span>Page 1 of 6</span>
            <button className="px-2 py-1 text-slate-400 hover:text-white">Next →</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
