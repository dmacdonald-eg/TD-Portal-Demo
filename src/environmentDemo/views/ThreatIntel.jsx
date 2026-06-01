import React from 'react';

/* Demo recreation of the real Threat Intelligence page (the ThreatDefender
   integration). Synthetic data — no API calls. Mirrors layout of
   src/components/threatfeed/ThreatFeedPage.jsx so SAs can demo it. */

const INDICATORS = [
  { value: '185.220.101.42', type: 'ipv4',   conf: 95, tags: ['tor-exit', 'aitm', 'evilginx'],          first: '2h ago',  hits: 27, sevSeen: 'red' },
  { value: 'login-microsoft-365[.]secure-acme[.]com', type: 'domain', conf: 92, tags: ['phishing', 'm365-impersonation'], first: '4h ago',  hits: 3,  sevSeen: 'red' },
  { value: 'bb39a1d7e44a…c8f2',     type: 'hash',   conf: 88, tags: ['lockbit', 'ransomware'],         first: '6h ago',  hits: null, sevSeen: null },
  { value: 'CVE-2026-1234',          type: 'cve',    conf: 99, tags: ['exchange', 'rce', 'kev'],         first: '1d ago',  hits: 1,  sevSeen: 'orange' },
  { value: '92.118.39.114',         type: 'ipv4',   conf: 78, tags: ['c2', 'cobalt-strike'],            first: '1d ago',  hits: null, sevSeen: null },
  { value: 'http://update[.]fakecdn[.]net/installer.msi', type: 'url', conf: 84, tags: ['dropper', 'malvertising'], first: '2d ago', hits: 1,  sevSeen: 'yellow' },
  { value: 'acme-payroll-portal[.]net', type: 'domain', conf: 73, tags: ['typosquat', 'credential-theft'], first: '3d ago', hits: null, sevSeen: null },
  { value: '5d41402abc4b…998a', type: 'hash',   conf: 65, tags: ['infostealer', 'redline'],            first: '4d ago',  hits: null, sevSeen: null },
];

const BRIEFINGS = [
  {
    category: 'Briefing',
    title: 'AiTM phishing kits are reusing legitimate M365 logos via SVG payloads',
    summary: 'A surge of EvilGinx-derived kits is embedding Microsoft branding as inline SVG to bypass image-hash detections. Recommended detection logic and CA hardening below.',
    techniques: ['T1566.002', 'T1556', 'T1539'],
    age: '4h ago',
    read: 6,
    accent: 'via-blue-500/60',
  },
  {
    category: 'Field note',
    title: 'BianLian shifts to pure extortion — what to look for in your tenant',
    summary: 'CISA advisory aligns with what we\'re seeing in incident traffic — exfil-then-extort, no encryption stage. KQL hunts for staging behaviour included.',
    techniques: ['T1567.002', 'T1059.001'],
    age: '1d ago',
    read: 8,
    accent: 'via-emerald-500/60',
  },
  {
    category: 'Vuln watch',
    title: 'Exchange Server RCE (CVE-2026-1234) — patch priority and detection',
    summary: 'Critical pre-auth RCE in on-prem Exchange (CVSS 9.8). Added to CISA KEV. Detection query for exploitation attempts in IIS logs included.',
    techniques: ['T1190', 'T1505.003'],
    age: '2d ago',
    read: 5,
    accent: 'via-purple-500/60',
  },
];

const VULNS = [
  { cve: 'CVE-2026-1234', sev: 'critical', title: 'Microsoft Exchange Server pre-auth RCE',                 src: 'CISA KEV',  age: '2d ago' },
  { cve: 'CVE-2026-1102', sev: 'high',     title: 'Fortinet FortiOS SSL-VPN authentication bypass',           src: 'NVD',       age: '3d ago' },
  { cve: 'CVE-2026-0987', sev: 'high',     title: 'Citrix NetScaler ADC memory corruption — actively exploited', src: 'CISA KEV', age: '5d ago' },
  { cve: 'CVE-2026-0844', sev: 'medium',   title: 'Atlassian Confluence template injection',                 src: 'NVD',       age: '6d ago' },
  { cve: 'CVE-2026-0712', sev: 'medium',   title: 'VMware vCenter Server arbitrary file read',               src: 'MSRC',      age: '1w ago' },
];

const TYPE_FILTERS = [
  { key: 'all', label: 'All', active: true },
  { key: 'domain', label: 'Domain' },
  { key: 'ipv4', label: 'IP' },
  { key: 'hash', label: 'Hash' },
  { key: 'url', label: 'URL' },
];

const BORDER_BY_SEV = {
  red: 'border-red-500',
  orange: 'border-orange-400',
  yellow: 'border-yellow-500/60',
  null: 'border-transparent',
};

const CHIP_BY_SEV = {
  red: 'bg-red-500/10 border-red-500/30 text-red-300',
  orange: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
  yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
};

const DOT_BY_SEV = {
  red: 'bg-red-400',
  orange: 'bg-orange-400',
  yellow: 'bg-yellow-400',
};

const VULN_BADGE = {
  critical: 'text-red-300 bg-red-500/10 border-red-500/20',
  high: 'text-orange-300 bg-orange-500/10 border-orange-500/20',
  medium: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20',
};

export default function ThreatIntelView() {
  return (
    <div className="space-y-8">
      {/* ─── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 glow-pulse" />
            <span>Powered by ThreatDefender · Live</span>
          </div>
          <h1 className="heading-serif text-4xl text-white">Threat Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Global indicators of compromise, briefings, and detection guidance — cross-referenced against your tenant.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Updated 12s ago</span>
          <button className="px-3 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-600">
            Reload
          </button>
        </div>
      </div>

      {/* ─── Ingest strip ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-pulse" />
            <span className="eyebrow">Ingest</span>
          </div>
          <span className="text-slate-400">
            Last indicator <span className="text-emerald-300">2m ago</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <span className="text-slate-400">
            <span className="text-slate-200 num-serif text-sm mr-1">+1,284</span>
            in last 24h
          </span>
          <span className="text-slate-400">
            <span className="text-slate-200 num-serif text-sm mr-1">182,917</span>
            corpus
          </span>
        </div>
      </div>

      {/* ─── Pulse + KPI strip ────────────────────────────────────────── */}
      <section data-tour="threatintel-pulse" className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7 rounded-2xl p-8 relative overflow-hidden pulse-card-bg border border-slate-800">
          <div className="absolute inset-0 dot-field opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="eyebrow mb-4">Today on ThreatDefender · The Pulse</div>
            <p className="heading-serif text-2xl leading-snug text-slate-100 max-w-2xl">
              AiTM kits are the story of the week — three campaigns observed targeting M365 admins,
              all using reverse-proxy infrastructure to harvest session tokens after MFA. Conditional
              Access alone isn't enough; phishing-resistant credentials are the lever.
            </p>
            <div className="hairline mt-6 mb-5" />
            <dl className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="eyebrow mb-1">New today</dt>
                <dd className="num-serif text-3xl text-white">1,284</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Updated today</dt>
                <dd className="num-serif text-3xl text-white">2,047</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Sources active</dt>
                <dd className="num-serif text-3xl text-white">18</dd>
              </div>
            </dl>
            <div className="mt-7 flex items-center gap-3 text-xs">
              <button className="px-3 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200 hover:border-blue-500 hover:text-white">
                Read full Pulse →
              </button>
              <span className="text-slate-500">~ 4 min</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 grid grid-cols-2 gap-4">
          <KpiCard label="IOC corpus" value="182,917" sub={<>+1,284 in last 24h <span className="text-emerald-400">↑</span></>} />
          <KpiCard label="Seen in your env" value="14" valueClass="text-orange-300" sub="38 event hits · 30d" />
          <KpiCard label="Briefings" value="7" sub="recently published" />
          <KpiCard label="Updated today" value="2,047" valueClass="text-emerald-300" sub="indicators refreshed" />
        </div>
      </section>

      {/* ─── Indicator feed ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="eyebrow mb-2">Live indicator feed</div>
            <h2 className="heading-serif text-2xl text-white">Indicators of compromise</h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="eyebrow text-[9px] mr-2">Type</span>
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    f.active
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input type="checkbox" className="accent-blue-500" readOnly />
              <span>Only seen in my environment</span>
            </label>
          </div>
        </div>

        <div data-tour="threatintel-feed" className="bg-slate-900/85 border border-slate-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-6 py-3 border-b border-slate-800 eyebrow">
            <div className="col-span-4">Indicator</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-3">Tags</div>
            <div className="col-span-1 text-right">Conf.</div>
            <div className="col-span-1">First seen</div>
            <div className="col-span-2 text-right pr-2">In your env</div>
          </div>

          {INDICATORS.map((ind, i) => {
            const sev = ind.sevSeen;
            const confColor = ind.conf >= 90 ? 'text-slate-100' : ind.conf >= 70 ? 'text-slate-300' : 'text-slate-500';
            return (
              <div
                key={i}
                className={`grid grid-cols-12 gap-3 px-6 py-3.5 items-center text-sm border-l-2 hover:bg-slate-800/40 transition-colors ${BORDER_BY_SEV[sev] || 'border-transparent'}`}
              >
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <span className="font-mono text-slate-200 text-[13px] truncate">{ind.value}</span>
                  <span className="text-slate-500 hover:text-white text-xs px-1 shrink-0 cursor-pointer">⧉</span>
                </div>
                <div className="col-span-1">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">{ind.type}</span>
                </div>
                <div className="col-span-3 text-slate-400 text-[12px] truncate">
                  {ind.tags.slice(0, 3).join(' · ')}
                </div>
                <div className={`col-span-1 text-right tabular-nums text-sm ${confColor}`}>{ind.conf}</div>
                <div className="col-span-1 text-slate-500 text-xs">{ind.first}</div>
                <div className="col-span-2 text-right">
                  {ind.hits != null ? (
                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border text-[11px] font-medium ${CHIP_BY_SEV[sev]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${DOT_BY_SEV[sev]}`} />
                      {ind.hits} hits · sentinel
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Page 1 · 8 indicators · corpus 182,917</span>
            <div className="flex items-center gap-2">
              <button disabled className="px-3 py-1 rounded border border-slate-700 text-slate-300 opacity-40">‹ Prev</button>
              <button className="px-3 py-1 rounded border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500">Next ›</button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Briefings + Vuln digest ───────────────────────────────────── */}
      <section className="grid grid-cols-12 gap-6">
        <div data-tour="threatintel-briefings" className="col-span-12 xl:col-span-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="eyebrow mb-2">From ThreatDefender · Briefings</div>
              <h2 className="heading-serif text-2xl text-white">Recent threat briefings</h2>
            </div>
            <span className="text-xs text-slate-400">All briefings →</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BRIEFINGS.map((b, i) => (
              <div
                key={i}
                className="bg-slate-900/85 border border-slate-800 rounded-xl p-5 relative overflow-hidden hover:border-blue-500/40 transition cursor-pointer"
              >
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${b.accent} to-transparent`} />
                <div className="absolute top-0 right-0 dot-field w-32 h-32 opacity-25 pointer-events-none" />
                <div className="eyebrow mb-3 flex items-center gap-2">
                  <span className="text-blue-300">{b.category}</span>
                  <span className="text-slate-700">·</span>
                  <span>{b.age} · {b.read} min</span>
                </div>
                <h3 className="heading-serif text-lg text-white leading-snug mb-2">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{b.summary}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {b.techniques.map((t) => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-tour="threatintel-vulns" className="col-span-12 xl:col-span-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="eyebrow mb-2">CISA KEV · NVD · MSRC</div>
              <h2 className="heading-serif text-2xl text-white">Vulnerability digest</h2>
            </div>
          </div>

          <div className="bg-slate-900/85 border border-slate-800 rounded-xl divide-y divide-slate-800/70">
            {VULNS.map((v, i) => (
              <div key={i} className="block p-4 hover:bg-slate-800/40 cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="font-mono text-[12px] text-blue-300 truncate">{v.cve}</span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${VULN_BADGE[v.sev]}`}>
                    {v.sev}
                  </span>
                </div>
                <div className="text-sm text-slate-200 leading-snug mb-1.5 line-clamp-2">{v.title}</div>
                <div className="text-[11px] text-slate-500">{v.src} · {v.age}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <div className="hairline" />
      <div className="flex items-center justify-between text-xs text-slate-500 pb-4">
        <div>
          Powered by <span className="text-slate-300">ThreatDefender</span> · Cross-reference uses sign-in,
          device-network, file, and email events from your tenant (last 30d).
        </div>
        <div className="flex items-center gap-4">
          <span>STIX 2.1 · TAXII 2.1</span>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, valueClass = 'text-white', sub }) {
  return (
    <div className="rounded-xl p-5 relative overflow-hidden marquee-bg border border-slate-800">
      <div className="eyebrow mb-3">{label}</div>
      <div className={`num-serif text-5xl leading-none ${valueClass}`}>{value}</div>
      {sub && <div className="mt-3 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}
