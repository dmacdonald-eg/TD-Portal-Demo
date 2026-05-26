import React from 'react';
import {
  Search, MailOpen, FileSearch, Fish, Link2, ShieldAlert, Monitor, Inbox, Shield, Siren,
  ChevronRight,
} from 'lucide-react';
import { Card, TONE } from '../shared';

const TOOLS = [
  { id: 'threat-intel',     name: 'Threat Intel Lookup',     desc: 'Look up IPs, domains, URLs, and file hashes across multiple threat intelligence sources including VirusTotal, AbuseIPDB, Shodan, and more.', icon: Search,       tone: 'blue' },
  { id: 'email-headers',    name: 'Email Header Analyzer',   desc: 'Paste raw email headers to analyze delivery path, authentication (SPF/DKIM/DMARC), and detect spoofing, phishing, or security issues.',     icon: MailOpen,     tone: 'purple' },
  { id: 'email-posture',    name: 'Email Posture Check',     desc: 'Check any domain\'s SPF, DKIM, DMARC, and MX configuration to evaluate email security posture and identify misconfigurations.',             icon: FileSearch,   tone: 'emerald' },
  { id: 'phishing',         name: 'Phishing Email Analyzer', desc: 'Paste a suspicious email to auto-extract URLs, IPs, and domains, run them through threat intelligence, and get a phishing verdict.',        icon: Fish,         tone: 'red' },
  { id: 'url-scan',         name: 'URL / File Scanner',      desc: 'Submit a suspicious URL for detonation or look up a file hash (MD5/SHA1/SHA256) to check VirusTotal scan results and detection verdicts.',  icon: Link2,        tone: 'cyan' },
  { id: 'breach',           name: 'Dark Web / Breach Monitor', desc: 'Check if an email address or domain has appeared in known data breaches using the Have I Been Pwned database.',                            icon: ShieldAlert,  tone: 'amber' },
  { id: 'device',           name: 'Device / Isolation Check', desc: 'Look up a device by hostname or IP to check its Defender for Endpoint status, sensor health, exposure level, and isolation history.',     icon: Monitor,      tone: 'blue' },
  { id: 'mailbox',          name: 'Mailbox Rule Auditor',    desc: 'Scan for recent inbox rule changes across your organization and flag suspicious rules like external forwarding or auto-delete.',           icon: Inbox,        tone: 'purple' },
  { id: 'asset',            name: 'Asset Coverage',          desc: 'View endpoint onboarding, MFA registration, identity risk, and data source health across your environment.',                                 icon: Shield,       tone: 'emerald' },
  { id: 'emergency',        name: 'Emergency Escalation',    desc: 'Immediately escalate a security concern to the ThreatDefender team. Creates a high-priority support ticket for rapid response.',          icon: Siren,        tone: 'rose' },
];

export default function ToolsView() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Security Tools</h1>
        <p className="text-sm text-slate-400 mt-1">Investigate threats, analyze suspicious emails, and check security posture.</p>
      </div>

      <div data-tour="tools-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const tone = TONE[t.tone];
          return (
            <Card key={t.id} className={`p-6 hover:bg-slate-800/50 cursor-pointer transition-colors ${tone.border}`}>
              <div className="flex items-start gap-4">
                <div className={`${tone.bgSoft} ${tone.text} p-3 rounded-lg`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">{t.name}</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 shrink-0 mt-1" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
