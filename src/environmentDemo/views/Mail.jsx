import React from 'react';
import { Mailbox, Shield, MailX, CheckCircle2, User } from 'lucide-react';
import { Card, KpiCard, MultiSeriesArea, ProgressRing, ViewHeader } from '../shared';
import { TREND_14D } from '../data';

export default function MailView() {
  return (
    <div>
      <ViewHeader title="Mail Hygiene" />

      <div data-tour="mail-kpis" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard value="12.4K" label="Total Inbound" sublabel="Last 7 days" valueClass="text-blue-400" />
        <KpiCard value="1,694" label="Threats Detected" sublabel="13.6% of inbound" valueClass="text-rose-400" />
        <KpiCard value="98.2%" label="DMARC Pass" sublabel="Inbound auth" valueClass="text-green-400" />
        <KpiCard value="23" label="ZAP Activity" sublabel="Post-delivery purge" valueClass="text-amber-400" />
      </div>

      <Card data-tour="mail-trend" className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Threat Trend — Last 14 Days</h3>
        <MultiSeriesArea data={TREND_14D} height={120} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card data-tour="mail-delivery" className="p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Delivery Outcomes</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Delivered to inbox',     count: 11_840, pct: 88, color: 'bg-emerald-500' },
              { label: 'Routed to junk',         count: 612,    pct: 5,  color: 'bg-amber-500' },
              { label: 'Quarantined (Phish)',    count: 519,    pct: 4,  color: 'bg-orange-500' },
              { label: 'Quarantined (Malware)',  count: 328,    pct: 2,  color: 'bg-rose-500' },
              { label: 'Bulk filter',            count: 174,    pct: 1,  color: 'bg-slate-500' },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{r.label}</span>
                  <span className="text-slate-500 font-mono">{r.count.toLocaleString()} · {r.pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full ${r.color}`} style={{ width: `${Math.max(r.pct * 4, 4)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Authentication Compliance</h3>
          <div className="space-y-3">
            {[
              { proto: 'SPF',   pass: 98.2, color: '#10b981' },
              { proto: 'DKIM',  pass: 94.7, color: '#10b981' },
              { proto: 'DMARC', pass: 98.2, color: '#10b981' },
            ].map((p) => (
              <div key={p.proto} className="flex items-center gap-3">
                <ProgressRing value={p.pass} size={56} strokeWidth={5} color={p.color} suffix="%" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">{p.proto}</div>
                  <div className="text-xs text-slate-500">Pass rate · last 7 days</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Targeted Users</h3>
          <div className="space-y-1.5">
            {[
              { user: 'sarah.chen@acme.com',  hits: 47 },
              { user: 'cfo@acme.com',          hits: 32 },
              { user: 'legal@acme.com',         hits: 21 },
              { user: 'mike.davis@acme.com',    hits: 18 },
              { user: 'hr@acme.com',            hits: 14 },
            ].map((u) => (
              <div key={u.user} className="flex items-center gap-2 py-1.5 border-b border-slate-800 last:border-b-0">
                <User className="w-3 h-3 text-slate-500" />
                <span className="text-xs font-mono text-slate-300 flex-1">{u.user}</span>
                <span className="text-xs text-rose-300 font-bold">{u.hits}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card data-tour="mail-phish" className="p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Phishing Domains</h3>
          <div className="space-y-1.5">
            {[
              { sender: 'dhl-track.co',     hits: 142 },
              { sender: 'm365-sec.net',     hits: 88  },
              { sender: 'apple-id-rev.io',  hits: 51  },
              { sender: 'oracle-pay.app',   hits: 34  },
              { sender: 'workday-acme.cc',  hits: 22  },
            ].map((s) => (
              <div key={s.sender} className="flex items-center gap-2 py-1.5 border-b border-slate-800 last:border-b-0">
                <MailX className="w-3 h-3 text-rose-400" />
                <span className="text-xs font-mono text-slate-300 flex-1">{s.sender}</span>
                <span className="text-xs text-rose-300 font-bold">{s.hits}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card data-tour="mail-zap" className="p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">ZAP Activity (24h)</h3>
        <div className="flex items-end gap-1 h-16">
          {[2, 1, 4, 3, 2, 5, 8, 3, 1, 0, 2, 6, 9, 5, 3, 4, 2, 1, 7, 3, 2, 1, 4, 2].map((v, i) => (
            <div key={i} className="flex-1 bg-amber-500/60 rounded-t" style={{ height: `${Math.max(v * 10, 4)}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-slate-600">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>now</span>
        </div>
      </Card>
    </div>
  );
}
