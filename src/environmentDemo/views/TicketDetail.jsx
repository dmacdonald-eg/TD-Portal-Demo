import React from 'react';
import { ChevronLeft, Send, User } from 'lucide-react';
import { Card, ViewHeader } from '../shared';

const NOTES = [
  { author: 'mike.k', when: '32m ago', body: 'Containment confirmed. Sarah\'s sessions revoked, password reset queued. Investigating CA policy gap that allowed legacy auth through.' },
  { author: 'Sarah Chen', client: true, when: '1h ago', body: 'Confirmed I didn\'t sign in from Iceland — was working from the office all day. Please proceed with whatever you need.' },
  { author: 'jenna.r', when: '1h ago', body: 'Sarah — quick confirmation: were you working from your office today around 14:08 UTC? Need to rule out legitimate travel before proceeding with full account recovery.' },
  { author: 'mike.k', when: '2h ago', body: 'Triaging now. Source IP is a Tor exit node and the sign-in bypassed MFA — strong indicator of AiTM. Will recommend immediate session revocation.' },
];

export default function TicketDetailView({ onBack }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 mb-4">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to tickets
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono text-slate-400">#58472</span>
            <span className="text-xs font-semibold text-rose-400">P1</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/15 text-blue-300">In Progress</span>
            <span className="text-xs text-slate-500">Incident</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">INC-2847 — Suspicious sign-in from anonymizing proxy</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card data-tour="ticket-notes" className="p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Discussion Notes</h3>
            <div className="space-y-4">
              {NOTES.map((n, i) => (
                <div key={i} className="flex gap-3 pb-4 border-b border-slate-800 last:border-b-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0 ${
                    n.client ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>
                    {n.author.split(/[. ]/).slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-200">{n.author}</span>
                      {n.client && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">CLIENT</span>}
                      <span className="text-[10px] text-slate-500">{n.when}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card data-tour="ticket-post" className="p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Add a discussion note</h3>
            <textarea
              disabled
              placeholder="Your reply syncs straight to ConnectWise and notifies the assigned analyst..."
              className="w-full h-24 px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-xs text-slate-300 outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-slate-500">Posts as Sarah Chen · 1m typing buffer before delivery</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white">
                <Send className="w-3 h-3" /> Send to SOC
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card data-tour="ticket-summary" className="p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Summary</h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Priority',           value: 'P1', valueClass: 'text-rose-400 font-semibold' },
                { label: 'Status',             value: 'In Progress', valueClass: 'text-blue-300' },
                { label: 'SLA',                value: '2h 38m remaining', valueClass: 'text-emerald-400' },
                { label: 'Owner',              value: 'mike.k', valueClass: 'text-slate-300 font-mono' },
                { label: 'Board',              value: 'ETC-ThreatHunter' },
                { label: 'Type',               value: 'Incident' },
                { label: 'Created',            value: '2h ago · 14:08 UTC' },
                { label: 'Last Updated',       value: '32m ago' },
                { label: 'Parent Incident',    value: 'INC-2847', valueClass: 'text-blue-400 font-mono' },
              ].map((d) => (
                <div key={d.label} className="flex justify-between">
                  <span className="text-slate-500">{d.label}</span>
                  <span className={d.valueClass || 'text-slate-300'}>{d.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Activity</h3>
            <div className="space-y-2 text-[11px]">
              {[
                { time: '32m ago', text: 'Note added by mike.k' },
                { time: '1h ago',  text: 'Note added by Sarah Chen' },
                { time: '1h ago',  text: 'Note added by jenna.r' },
                { time: '1h 28m ago', text: 'Status changed: New → In Progress' },
                { time: '1h 28m ago', text: 'Assigned to mike.k' },
                { time: '2h ago',  text: 'Ticket created from INC-2847' },
              ].map((a, i) => (
                <div key={i} className="flex gap-2 text-slate-400">
                  <span className="text-slate-600 font-mono shrink-0">{a.time}</span>
                  <span>{a.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
