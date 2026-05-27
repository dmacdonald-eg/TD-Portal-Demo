import React, { useState } from 'react';
import {
  AlertTriangle, ChevronLeft, ChevronDown, Globe, Sparkles, User, Laptop, Hash,
  Shield, FileSearch, MessageSquare, Send,
} from 'lucide-react';
import { Card, ClassificationBadge, SeverityBadge, StatusBadge, TONE } from '../shared';

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview', tour: 'detail-tab-overview' },
  { id: 'timeline', label: 'Timeline', tour: 'detail-tab-timeline' },
  { id: 'alerts',   label: 'Alerts',   tour: 'detail-tab-alerts',   count: 1 },
  { id: 'entities', label: 'Entities', tour: 'detail-tab-entities', count: 4 },
  { id: 'comments', label: 'Comments', tour: 'detail-tab-comments', count: 3 },
];

function ExpandableAlertCard({ onTourTargetClick }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-slate-800">
      <button
        data-tour="alert-card-expand"
        onClick={() => {
          setOpen((o) => !o);
          onTourTargetClick?.('alert-card-expand');
        }}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-slate-200">Anonymous IP address sign-in</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Microsoft Defender for Cloud Apps · 14:08:23 UTC · Confidence: <span className="text-amber-300 font-semibold">High</span></div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-800">
          <div className="pt-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Description</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A successful sign-in occurred from an IP address (185.220.101.42) recognized as an anonymous proxy
              or Tor exit node. This may indicate an attempt to conceal the user's true location and bypass
              location-based Conditional Access controls.
            </p>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Entities</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { icon: User, label: 'sarah.chen@acme.com', color: 'blue' },
                { icon: Globe, label: '185.220.101.42', color: 'rose' },
                { icon: Laptop, label: 'LAPTOP-CHEN-01', color: 'cyan' },
              ].map((e) => {
                const Icon = e.icon;
                const tone = TONE[e.color];
                return (
                  <span key={e.label} className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-slate-700 bg-slate-950 text-[11px]">
                    <Icon className={`w-3 h-3 ${tone.text}`} /> {e.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Evidence (ExtendedProperties)</div>
            <pre className="text-[10.5px] font-mono text-slate-400 bg-slate-950 rounded p-2 overflow-x-auto leading-relaxed">{`{
  "AnomalyScore": 8.4,
  "AsnNumber": "AS208294",
  "AsnOrganization": "TOR Exit Network",
  "City": "Reykjavik",
  "Country": "IS",
  "DeviceTrustType": "Untrusted",
  "MfaAuthenticated": false,
  "ResultType": 0
}`}</pre>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Remediation Steps</div>
            <ul className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
              <li>Revoke all active sessions for sarah.chen@acme.com</li>
              <li>Force password reset and require MFA reregistration</li>
              <li>Review Conditional Access policy gaps allowing legacy auth</li>
              <li>Block IP 185.220.101.42 at perimeter and in Defender</li>
              <li>Audit any actions taken by this user in the last 48 hours</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button className="text-[11px] text-blue-400 hover:underline">Open in Sentinel ↗</button>
            <span className="text-slate-700">·</span>
            <button className="text-[11px] text-blue-400 hover:underline">Re-run detection query</button>
            <span className="text-slate-700">·</span>
            <button className="text-[11px] text-blue-400 hover:underline">View related incidents</button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function IncidentDetailView({ onBack, onTourTargetClick }) {
  const [tab, setTab] = useState('overview');

  const handleTabClick = (id, tour) => {
    setTab(id);
    onTourTargetClick?.(tour);
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 mb-4">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to incidents
      </button>

      <div data-tour="detail-header" className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono text-slate-400">INC-2847</span>
            <SeverityBadge severity="High" />
            <StatusBadge status="Active" />
            <ClassificationBadge classification="Undetermined" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Suspicious sign-in from anonymizing proxy</h1>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> SOAR Actions <ChevronDown className="w-3 h-3" />
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Open in Sentinel
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-800 mb-6">
        {DETAIL_TABS.map((t) => (
          <button
            key={t.id}
            data-tour={t.tour}
            onClick={() => handleTabClick(t.id, t.tour)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${tab === t.id ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            {t.label}
            {t.count != null && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded">{t.count}</span>
            )}
            {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <Card data-tour="ai-summary" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Sara — Incident Summary</div>
                  <div className="text-[10px] text-slate-500">ThreatDefender AI Security Agent · 2s ago</div>
                </div>
              </div>
              <button className="text-xs text-blue-400 hover:underline">Regenerate</button>
            </div>

            {/* Rich markdown-style Sara summary with subsections */}
            <div className="space-y-5 text-sm text-slate-300 leading-relaxed">
              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-2">What Happened</h4>
                <p>
                  User account (<span className="text-slate-100 font-semibold">sarah.chen@acme.com</span>) successfully
                  authenticated from <span className="text-slate-100 font-semibold">Reykjavík, Iceland</span> — a country
                  this user has never signed in from before. The source IP (<span className="font-mono">185.220.101.42</span>)
                  is a known Tor exit node. Sign-in bypassed MFA because the Conditional Access policy excluded the legacy
                  mail client the attacker used to request the token.
                </p>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-2">Impact</h4>
                <div className="rounded-lg border border-slate-800 overflow-hidden mb-3">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-900/60">
                      <tr className="text-slate-500">
                        <th className="text-left px-3 py-2 font-medium w-1/3">Entity</th>
                        <th className="text-left px-3 py-2 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-800/60">
                        <td className="px-3 py-2 text-slate-100 font-semibold">User</td>
                        <td className="px-3 py-2 text-slate-300">Sarah Chen (sarah.chen@acme.com)</td>
                      </tr>
                      <tr className="border-t border-slate-800/60">
                        <td className="px-3 py-2 text-slate-100 font-semibold">Account Type</td>
                        <td className="px-3 py-2 text-slate-300">Standard user · member of Helpdesk-Admins (temporary)</td>
                      </tr>
                      <tr className="border-t border-slate-800/60">
                        <td className="px-3 py-2 text-slate-100 font-semibold">Application Accessed</td>
                        <td className="px-3 py-2 text-slate-300">Office 365 Exchange Online (legacy SMTP auth)</td>
                      </tr>
                      <tr className="border-t border-slate-800/60">
                        <td className="px-3 py-2 text-slate-100 font-semibold">Source IP</td>
                        <td className="px-3 py-2 text-slate-300 font-mono">185.220.101.42 (Tor exit node, Iceland)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  The authentication was successful, meaning the user (or someone with their credentials) gained access to
                  Sarah's mailbox and any resources she had inherited rights to via her temporary Helpdesk-Admins membership.
                </p>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-2">Key Findings</h4>
                <ul className="space-y-1.5 list-disc list-inside marker:text-slate-600">
                  <li><span className="text-slate-100 font-semibold">New Location:</span> Reykjavík, Iceland (IP 185.220.101.42) — never seen for this user</li>
                  <li><span className="text-slate-100 font-semibold">Previous Locations:</span> United States only (last 90 days)</li>
                  <li><span className="text-slate-100 font-semibold">Device Details:</span> Linux + Thunderbird mail client (UA: Thunderbird/115)</li>
                  <li><span className="text-slate-100 font-semibold">Device Compliance:</span> Device was not managed and not Intune-enrolled</li>
                  <li><span className="text-slate-100 font-semibold">MFA Status:</span> Bypassed — legacy auth path exempted from CA policy</li>
                  <li><span className="text-slate-100 font-semibold">Travel Watchlist:</span> User was not on any known travel watchlist</li>
                  <li><span className="text-slate-100 font-semibold">Detection Time:</span> May 22, 2026 at 14:08 UTC</li>
                </ul>
                <p className="mt-3">
                  The IP, geography, device fingerprint, and MFA-bypass path together match the signature of an
                  adversary-in-the-middle phishing kit (EvilGinx family). Related incident INC-2846 same user, opened 3
                  hours earlier, suggests the lure was a SharePoint share notification.
                </p>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-2">Resolution</h4>
                <p>
                  This incident has been <span className="text-slate-100 font-semibold">acknowledged</span> and is{' '}
                  <span className="text-slate-100 font-semibold">Active</span>. Analyst{' '}
                  <span className="text-slate-100 font-semibold">mike.k</span> has revoked all primary refresh tokens for
                  the user, forced a password reset, blocked the source IP at the perimeter, and removed the user's
                  temporary Helpdesk-Admins membership. Awaiting confirmation that no mailbox content was exfiltrated
                  before classifying as True Positive.
                </p>
              </section>
            </div>
          </Card>

          <Card data-tour="incident-chat" className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-200">Ask Sara about this incident</h3>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-medium text-white shrink-0">SC</div>
                <div className="flex-1 bg-slate-800/60 rounded-lg rounded-tl-sm px-3 py-2 text-xs text-slate-200">
                  Did the attacker access any mailboxes during the compromise window?
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-blue-500/10 rounded-lg rounded-tl-sm px-3 py-2 text-xs text-slate-200 leading-relaxed border border-blue-500/20">
                  Checking Exchange audit logs for sarah.chen between 14:08–14:35 UTC...
                  <span className="block mt-1.5">3 mailbox operations observed: MessageRead (×27), MailboxLogin (×1), Search (×4). No Send, no rule creation, no item export.
                  The attacker did access her inbox but didn't exfiltrate or create persistence. Recommend a deeper review of which 27 messages were opened.</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-slate-700 bg-slate-950">
              <input disabled placeholder="Ask a follow-up question..." className="bg-transparent text-xs text-slate-300 outline-none flex-1" />
              <button className="text-blue-400 hover:text-blue-300"><Send className="w-3.5 h-3.5" /></button>
            </div>
          </Card>

          <Card data-tour="details-grid" className="p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {[
                { label: 'Created',         value: '2h ago · 14:08 UTC' },
                { label: 'First Modified',   value: '14:09 UTC (auto)' },
                { label: 'Last Modified',    value: '32m ago' },
                { label: 'Analyst',          value: 'mike.k' },
                { label: 'Alert Count',      value: '1' },
                { label: 'Entities',         value: '4' },
                { label: 'Ticket',           value: '#58472', valueClass: 'text-blue-400 font-mono' },
                { label: 'Closed',           value: '—' },
              ].map((d) => (
                <div key={d.label}>
                  <div className="text-slate-500 mb-0.5">{d.label}</div>
                  <div className={d.valueClass || 'text-slate-300'}>{d.value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card data-tour="mitre" className="p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">MITRE ATT&CK</h3>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Tactics</div>
                <div className="flex flex-wrap gap-1.5">
                  {['Initial Access', 'Defense Evasion', 'Credential Access'].map((t) => (
                    <span key={t} className="px-2 py-1 text-[11px] rounded bg-amber-900/30 text-amber-300 border border-amber-800/50">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Techniques</div>
                <div className="flex flex-wrap gap-1.5">
                  {['T1078 Valid Accounts', 'T1566 Phishing', 'T1090 Proxy', 'T1556 Modify Auth'].map((t) => (
                    <span key={t} className="px-2 py-1 text-[11px] rounded bg-slate-800 text-slate-300 font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'alerts' && (
        <div className="space-y-3">
          <ExpandableAlertCard onTourTargetClick={onTourTargetClick} />
        </div>
      )}

      {tab === 'entities' && (
        <Card className="p-5">
          <div className="space-y-4">
            {[
              { type: 'Accounts (1)', icon: User,   color: 'blue', items: ['sarah.chen@acme.com'] },
              { type: 'IPs (1)',      icon: Globe,  color: 'rose', items: ['185.220.101.42'] },
              { type: 'Hosts (1)',    icon: Laptop, color: 'cyan', items: ['LAPTOP-CHEN-01'] },
              { type: 'Sessions (1)', icon: Hash,   color: 'slate', items: ['Session 4f2c-…-9a1b'] },
            ].map((g) => {
              const Icon = g.icon;
              const tone = TONE[g.color];
              return (
                <div key={g.type}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-3.5 h-3.5 ${tone.text}`} />
                    <span className="text-xs font-semibold text-slate-400">{g.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-5">
                    {g.items.map((i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300 font-mono">{i}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === 'comments' && (
        <Card className="p-5 space-y-4">
          {[
            { author: 'mike.k',  when: '32m ago', body: 'Revoked all sessions for sarah.chen and forced password reset. Investigating Conditional Access policy gap that allowed legacy auth through.' },
            { author: 'jenna.r', when: '1h ago',  body: 'Confirmed source IP is a known Tor exit node. Geographic anomaly + MFA bypass strongly suggests AiTM kit usage. INC-2846 is also from this user.' },
            { author: 'mike.k',  when: '2h ago',  body: 'Acknowledged. Pulling sign-in logs for the past 48 hours to look for related activity.' },
          ].map((c, i) => (
            <div key={i} className="flex gap-3 pb-3 border-b border-slate-800 last:border-b-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white shrink-0">
                {c.author.split('.').map((p) => p[0].toUpperCase()).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-200">{c.author}</span>
                  <span className="text-[10px] text-slate-500">{c.when}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === 'timeline' && (
        <Card className="p-5">
          <div className="space-y-3">
            {[
              { time: '14:08 UTC', event: 'Incident Created',          desc: 'Sentinel correlated 1 alert from MDCA',         icon: AlertTriangle, color: 'text-rose-400' },
              { time: '14:09 UTC', event: 'ThreatDefender Enrichment', desc: 'Sara summary generated, ticket #58472 opened', icon: Sparkles,       color: 'text-blue-400' },
              { time: '14:32 UTC', event: 'Analyst Claimed',           desc: 'mike.k acknowledged the incident',              icon: User,           color: 'text-cyan-400' },
              { time: '14:35 UTC', event: 'SOAR Action',               desc: 'Session revocation playbook executed',          icon: Shield,         color: 'text-emerald-400' },
              { time: '14:38 UTC', event: 'Investigation Updated',     desc: 'Containment notes added to investigation panel', icon: FileSearch,    color: 'text-violet-400' },
            ].map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-800 last:border-b-0">
                  <Icon className={`w-4 h-4 ${e.color} mt-0.5 shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-slate-200">{e.event}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{e.time}</span>
                    </div>
                    <p className="text-xs text-slate-400">{e.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
