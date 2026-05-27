import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Card, ViewHeader } from '../shared';
import { TICKETS } from '../data';

export default function TicketsView({ onTicketClick }) {
  return (
    <div>
      <ViewHeader title="Tickets" subtitle="Security incident tickets tracked by our analysts" />
      <Card className="p-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-950 flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input disabled placeholder="Search tickets..." className="bg-transparent text-xs text-slate-300 outline-none flex-1" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 rounded-md border border-slate-700 bg-slate-900">
            All Statuses <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </Card>

      <Card data-tour="tickets-table" className="overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-900 text-slate-500 border-b border-slate-800">
            <tr>
              {['#', 'Summary', 'Priority', 'Status', 'Owner', 'Type', 'Updated'].map((c) => (
                <th key={c} className="text-left px-3 py-2 font-medium">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TICKETS.map((r) => {
              const priColor = r.pri === 'P1' ? 'text-rose-400' : r.pri === 'P2' ? 'text-orange-400' : 'text-slate-400';
              const statusColor = r.status === 'In Progress' ? 'text-blue-300' : r.status === 'Awaiting Client' ? 'text-amber-300' : 'text-emerald-400';
              return (
                <tr
                  key={r.num}
                  data-tour={r.num === 58472 ? 'ticket-row-58472' : undefined}
                  onClick={() => r.num === 58472 && onTicketClick?.()}
                  className="border-t border-slate-800/50 hover:bg-slate-800/40 cursor-pointer"
                >
                  <td className="px-3 py-2 text-blue-400 font-mono">#{r.num}</td>
                  <td className="px-3 py-2 text-slate-300 truncate max-w-md">{r.title}</td>
                  <td className={`px-3 py-2 font-semibold ${priColor}`}>{r.pri}</td>
                  <td className={`px-3 py-2 ${statusColor}`}>{r.status}</td>
                  <td className="px-3 py-2 text-slate-400 font-mono">{r.owner}</td>
                  <td className="px-3 py-2 text-slate-500">{r.type}</td>
                  <td className="px-3 py-2 text-slate-500">{r.age}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
