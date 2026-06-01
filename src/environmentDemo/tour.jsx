import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, ChevronRight, ChevronLeft, X, Play, RotateCcw,
} from 'lucide-react';

/* Tour step definitions + popover component.
   Each step is tagged with a `module` so the per-user filter in
   EnvironmentDemo.jsx can include/exclude it based on the logged-in user's
   module list. Welcome + complete have no module — always shown. */

export const STEPS = [
  // ── WELCOME ─────────────────────────────────────────────────────────────
  {
    id: 'welcome', view: null, placement: 'center',
    title: 'Welcome to the Client Portal',
    body: 'A 5-minute walkthrough of what your team sees when they sign in. Click highlighted elements to advance, or use Next to step through.',
    cta: 'Start tour',
  },

  // ── DASHBOARD ───────────────────────────────────────────────────────────
  {
    id: 'active-banner', module: 'dashboard', view: 'dashboard', target: 'active-banner', placement: 'bottom',
    title: 'Active incidents at a glance',
    body: 'Real-time count of open incidents broken down by severity, plus age of the oldest. Visible the moment you sign in — no clicks needed.',
  },
  {
    id: 'tickets-banner', module: 'dashboard', view: 'dashboard', target: 'tickets-banner', placement: 'bottom',
    title: 'Open Incident Tickets',
    body: 'The live ticket count for open security incidents our analysts are tracking — separates "in progress" from "awaiting client response" so you know what needs your attention.',
  },
  {
    id: 'kpi-grid', module: 'dashboard', view: 'dashboard', target: 'kpi-grid', placement: 'bottom',
    title: 'KPIs computed live from your incidents',
    body: 'Triage and resolution medians, SLA compliance, true positive rate — all calculated client-side from your actual Sentinel data. Not pre-rendered reports.',
  },
  {
    id: 'alert-trends', module: 'dashboard', view: 'dashboard', target: 'alert-trends', placement: 'top',
    title: 'Severity-stacked alert volume',
    body: 'See spikes by severity at a glance. Red = high, orange = medium, yellow = low, blue = informational.',
  },
  {
    id: 'top-rules', module: 'dashboard', view: 'dashboard', target: 'top-rules', placement: 'right',
    title: 'Which detection rules are firing',
    body: 'Top analytic rules by hit count — tells you what threat patterns are most active in your environment.',
  },
  {
    id: 'data-sources', module: 'dashboard', view: 'dashboard', target: 'data-sources', placement: 'left',
    title: 'Data ingestion by source',
    body: 'Volume per data connector. If something stops ingesting, you see it here before you find out from missing alerts.',
  },
  {
    id: 'recent-incidents', module: 'dashboard', view: 'dashboard', target: 'recent-incidents', placement: 'top',
    title: 'Recent incidents with one-click drill-in',
    body: 'Click any row to jump straight to Sara\'s summarized investigation view.',
  },

  // ── INCIDENTS LIST ──────────────────────────────────────────────────────
  {
    id: 'go-incidents', module: 'incidents', view: 'dashboard', target: 'nav-incidents', placement: 'right',
    title: 'Drill into the full queue',
    body: 'Click "Incidents" in the sidebar to see all incidents with filters and sorting.',
    advance: 'click',
  },
  {
    id: 'incidents-filter', module: 'incidents', view: 'incidents-list', target: 'incidents-filter', placement: 'bottom',
    title: 'Search and filter',
    body: 'Free-text search across title and number, plus severity/status filters. URL-driven, so analysts can bookmark a filtered view.',
  },
  {
    id: 'incidents-table', module: 'incidents', view: 'incidents-list', target: 'incidents-table', placement: 'top',
    title: 'Full incident queue',
    body: '9 columns including owner assignment, alert count, support ticket cross-reference, and classification — all sortable.',
  },
  {
    id: 'click-incident-row', module: 'incidents', view: 'incidents-list', target: 'incident-row-2847', placement: 'bottom',
    title: 'Click into INC-2847',
    body: 'Every row is clickable. Click INC-2847 to see Sara\'s summarized investigation view.',
    advance: 'click',
  },

  // ── INCIDENT DETAIL ─────────────────────────────────────────────────────
  {
    id: 'detail-header', module: 'incidents', view: 'incident-detail', target: 'detail-header', placement: 'bottom',
    title: 'Incident header at a glance',
    body: 'Number, severity, status, classification, title — plus "Open in Sentinel" to deep-link into the Azure Portal.',
  },
  {
    id: 'ai-summary', module: 'incidents', view: 'incident-detail', target: 'ai-summary', placement: 'left',
    title: 'Sara — summarized incidents',
    body: 'Sara, your AI Security agent, reads alerts, entities, and evidence and produces a structured summary with What Happened, Impact, Key Findings, and Resolution sections — the same investigation narrative your analysts read.',
  },
  {
    id: 'incident-chat', module: 'incidents', view: 'incident-detail', target: 'incident-chat', placement: 'top',
    title: 'Ask Sara — conversational investigation',
    body: 'Ask Sara follow-up questions about the incident in plain English. She pulls related signals from Sentinel — sign-in logs, mailbox audit, device events — to answer.',
  },
  {
    id: 'details-grid', module: 'incidents', view: 'incident-detail', target: 'details-grid', placement: 'top',
    title: 'Incident metadata',
    body: 'Timestamps, analyst assignment, alert count, and a cross-link to the matching support ticket.',
  },
  {
    id: 'mitre', module: 'incidents', view: 'incident-detail', target: 'mitre', placement: 'top',
    title: 'MITRE ATT&CK mapping',
    body: 'Tactics and techniques auto-extracted from the underlying alerts. See what attacker behavior was detected.',
  },
  {
    id: 'click-alerts-tab', module: 'incidents', view: 'incident-detail', target: 'detail-tab-alerts', placement: 'right',
    title: 'Drill into the underlying alerts',
    body: 'Click the Alerts tab to see the raw alert data that fed this incident.',
    advance: 'click',
  },
  {
    id: 'expand-alert', module: 'incidents', view: 'incident-detail', target: 'alert-card-expand', placement: 'bottom',
    title: 'Expandable alert details',
    body: 'Click to expand for full alert evidence: description, entities, raw events, remediation steps, confidence level.',
    advance: 'click',
  },
  {
    id: 'click-timeline-tab', module: 'incidents', view: 'incident-detail', target: 'detail-tab-timeline', placement: 'right',
    title: 'Investigation timeline',
    body: 'Click the Timeline tab to see milestones: when the incident fired, who claimed it, what SOAR actions ran.',
    advance: 'click',
  },
  {
    id: 'click-entities-tab', module: 'incidents', view: 'incident-detail', target: 'detail-tab-entities', placement: 'right',
    title: 'Entity correlation',
    body: 'Click Entities to see all accounts, IPs, hosts, and sessions involved — grouped by type.',
    advance: 'click',
  },
  {
    id: 'click-comments-tab', module: 'incidents', view: 'incident-detail', target: 'detail-tab-comments', placement: 'right',
    title: 'Analyst comments',
    body: 'Click Comments to see the SOC team\'s discussion during triage. Full audit trail of the investigation.',
    advance: 'click',
  },

  // ── TICKETS ─────────────────────────────────────────────────────────────
  {
    id: 'go-tickets', module: 'tickets', view: 'incident-detail', target: 'nav-tickets', placement: 'right',
    title: 'Support tickets',
    body: 'Click "Tickets" in the sidebar to see all open and recent support tickets.',
    advance: 'click',
  },
  {
    id: 'tickets-table', module: 'tickets', view: 'tickets', target: 'tickets-table', placement: 'top',
    title: 'Ticket queue, scoped to your company',
    body: 'Synced from our ticketing system in real time. Only your company\'s open tickets shown — never other clients\'.',
  },
  {
    id: 'click-ticket-row', module: 'tickets', view: 'tickets', target: 'ticket-row-58472', placement: 'right',
    title: 'Click into a ticket',
    body: 'Drill into ticket #58472 to see full detail and the discussion thread.',
    advance: 'click',
  },
  {
    id: 'ticket-detail-summary', module: 'tickets', view: 'ticket-detail', target: 'ticket-summary', placement: 'right',
    title: 'Ticket summary panel',
    body: 'SLA status, priority, type, assigned analyst, parent incident cross-link.',
  },
  {
    id: 'ticket-notes', module: 'tickets', view: 'ticket-detail', target: 'ticket-notes', placement: 'top',
    title: 'Discussion notes thread',
    body: 'Two-way conversation between your team and the SOC — keep the discussion in one place, in context with the ticket.',
  },
  {
    id: 'ticket-post', module: 'tickets', view: 'ticket-detail', target: 'ticket-post', placement: 'top',
    title: 'Reply to the SOC',
    body: 'Post a discussion note here. It syncs straight to our ticketing system and notifies the assigned analyst.',
  },

  // ── SENTINEL HEALTH ─────────────────────────────────────────────────────
  {
    id: 'go-health', module: 'health', view: 'ticket-detail', target: 'nav-health', placement: 'right',
    title: 'Sentinel platform health',
    body: 'Click "Sentinel Health" to monitor data ingestion, connector status, and rule execution.',
    advance: 'click',
  },
  {
    id: 'health-overview', module: 'health', view: 'health', target: 'health-overview', placement: 'bottom',
    title: 'Health at a glance',
    body: 'Unified status banner — green/yellow/red — with a "Needs Attention" section if anything is degraded.',
  },
  {
    id: 'click-ingestion-tab', module: 'health', view: 'health', target: 'health-tab-ingestion', placement: 'right',
    title: 'Data ingestion deep-dive',
    body: 'Click the Ingestion tab to see daily volume per table and EPS trends.',
    advance: 'click',
  },
  {
    id: 'click-freshness-tab', module: 'health', view: 'health', target: 'health-tab-freshness', placement: 'right',
    title: 'Per-table freshness',
    body: 'Click the Freshness tab — batch-aware thresholds catch stale data before it hides an attack.',
    advance: 'click',
  },
  {
    id: 'click-connectors-tab', module: 'health', view: 'health', target: 'health-tab-connectors', placement: 'right',
    title: 'Connector status',
    body: 'Click the Connectors tab to see per-connector success rates and any failed events.',
    advance: 'click',
  },
  {
    id: 'click-rules-tab', module: 'health', view: 'health', target: 'health-tab-rules', placement: 'right',
    title: 'Analytic rule execution',
    body: 'Click Rule Health to see which rules are succeeding, which are throwing errors, and where to look first.',
    advance: 'click',
  },

  // ── MAIL HYGIENE ────────────────────────────────────────────────────────
  {
    id: 'go-mail', module: 'mail', view: 'health', target: 'nav-mail', placement: 'right',
    title: 'Mail hygiene from Defender for Office 365',
    body: 'Click "Mail Hygiene" in the sidebar.',
    advance: 'click',
  },
  {
    id: 'mail-kpis', module: 'mail', view: 'mail', target: 'mail-kpis', placement: 'bottom',
    title: 'Mail volume and threats',
    body: 'Inbound volume, threat detections, DMARC pass rate, and zero-hour auto-purge activity — last 7 days.',
  },
  {
    id: 'mail-trend', module: 'mail', view: 'mail', target: 'mail-trend', placement: 'top',
    title: 'Threat trend',
    body: 'Daily threat volume by severity — same stacked-area visualization as the incident trend.',
  },
  {
    id: 'mail-delivery', module: 'mail', view: 'mail', target: 'mail-delivery', placement: 'right',
    title: 'Delivery outcome distribution',
    body: 'Where did inbound mail end up? Inbox, junk, quarantined, blocked — see exactly how your filtering policies are performing.',
  },
  {
    id: 'mail-phish', module: 'mail', view: 'mail', target: 'mail-phish', placement: 'left',
    title: 'Top phishing domains targeting you',
    body: 'Aggregated from MDO event data. Cross-reference to your block lists.',
  },
  {
    id: 'mail-zap', module: 'mail', view: 'mail', target: 'mail-zap', placement: 'top',
    title: 'Zero-hour Auto Purge activity',
    body: 'Mail that landed in inboxes and was post-delivery-purged by MDO — the messages your users almost saw.',
  },

  // ── IDENTITY HYGIENE ────────────────────────────────────────────────────
  {
    id: 'go-identity', module: 'identity', view: 'mail', target: 'nav-identity', placement: 'right',
    title: 'Identity attack surface',
    body: 'Click "Identity" in the sidebar.',
    advance: 'click',
  },
  {
    id: 'identity-kpis', module: 'identity', view: 'identity', target: 'identity-kpis', placement: 'bottom',
    title: 'Identity health metrics',
    body: 'Active users, risky users, failed sign-ins, stale accounts — all from Entra ID Protection and sign-in logs.',
  },
  {
    id: 'risky-users', module: 'identity', view: 'identity', target: 'risky-users', placement: 'top',
    title: 'Risky users from Entra ID Protection',
    body: 'Live risk flags — impossible travel, anonymous IPs, leaked credentials — with the MFA state of each account.',
  },
  {
    id: 'ca-policies', module: 'identity', view: 'identity', target: 'ca-policies', placement: 'right',
    title: 'Conditional Access policy performance',
    body: 'See which CA policies are actually blocking sign-ins and which are reporting-only. Catch policy gaps before attackers do.',
  },
  {
    id: 'mfa-coverage', module: 'identity', view: 'identity', target: 'mfa-coverage', placement: 'left',
    title: 'MFA enforcement breakdown',
    body: 'Which accounts are enforced vs registered-but-not-required vs no-MFA. Plus any legacy single-factor app detections.',
  },
  {
    id: 'identity-geo', module: 'identity', view: 'identity', target: 'identity-geo', placement: 'top',
    title: 'Geographic sign-in patterns',
    body: 'Sign-in locations over the last 7 days. Anomalous sources show in rose, atypical in amber.',
  },

  // ── THREAT INTEL ────────────────────────────────────────────────────────
  {
    id: 'go-threatintel', module: 'threat-intel', view: 'identity', target: 'nav-threatintel', placement: 'right',
    title: 'Threat intelligence, powered by ThreatOne',
    body: 'Click "Threat Intel" in the sidebar to see global IOCs cross-referenced against your tenant.',
    advance: 'click',
  },
  {
    id: 'threatintel-pulse', module: 'threat-intel', view: 'threat-intel', target: 'threatintel-pulse', placement: 'bottom',
    title: 'The Pulse — daily analyst snapshot',
    body: 'A fresh narrative each morning from ThreatOne. The "what matters today" cut, not just raw indicator volume.',
  },
  {
    id: 'threatintel-feed', module: 'threat-intel', view: 'threat-intel', target: 'threatintel-feed', placement: 'top',
    title: 'Live IOC feed cross-referenced to your tenant',
    body: 'Domains, IPs, hashes, URLs, CVEs — ingested from 18 sources via STIX/TAXII. The colored left border and "In your env" chip mark indicators ThreatDefender has already seen in your sign-in, device, file, or email events.',
  },
  {
    id: 'threatintel-briefings', module: 'threat-intel', view: 'threat-intel', target: 'threatintel-briefings', placement: 'top',
    title: 'Briefings, field notes, and vuln watches',
    body: 'ThreatOne analyst write-ups with detection logic, KQL hunts, and MITRE technique mappings — published as new campaigns and CVEs emerge.',
  },
  {
    id: 'threatintel-vulns', module: 'threat-intel', view: 'threat-intel', target: 'threatintel-vulns', placement: 'left',
    title: 'Vulnerability digest',
    body: 'Top CVEs from CISA KEV, NVD, and MSRC — prioritized by exploitability and presence on the KEV list.',
  },

  // ── REPORTS ─────────────────────────────────────────────────────────────
  {
    id: 'go-reports', module: 'reports', view: 'threat-intel', target: 'nav-reports', placement: 'right',
    title: 'Monthly reports',
    body: 'Click "Reports" in the sidebar to see branded deliverables.',
    advance: 'click',
  },
  {
    id: 'reports-table', module: 'reports', view: 'reports', target: 'reports-table', placement: 'top',
    title: 'Grouped by cadence with previews and AI summaries',
    body: 'Identity Risk (weekly), Vulnerability (monthly), Secure Score (quarterly) — each grouped section shows a gradient cover, AI-generated summary, and one-click preview or download. The latest report across all types gets a hero card up top.',
  },
  {
    id: 'click-posture-tab', module: 'reports', view: 'reports', target: 'reports-posture-tab', placement: 'bottom',
    title: 'Live security posture',
    body: 'Click "Security Posture" to see the live Microsoft Secure Score breakdown.',
    advance: 'click',
  },
  {
    id: 'secure-score', module: 'reports', view: 'reports', target: 'secure-score', placement: 'right',
    title: 'Microsoft Secure Score, live',
    body: 'Quarterly PDF plus a real-time posture meter with quick-win recommendations across Identity / Device / Application / Data.',
  },

  // ── TOOLS ───────────────────────────────────────────────────────────────
  {
    id: 'go-tools', module: 'tools', view: 'reports', target: 'nav-tools', placement: 'right',
    title: 'Self-service security tools',
    body: 'Click "Tools" in the sidebar to see investigation tools clients can run themselves.',
    advance: 'click',
  },
  {
    id: 'tools-grid', module: 'tools', view: 'tools', target: 'tools-grid', placement: 'top',
    title: '10 self-service security tools',
    body: 'VirusTotal, AbuseIPDB, GreyNoise, Shodan, OTX, HIBP, Defender for Endpoint isolation, phishing analyzer, URL sandbox. Every action audit-logged and rate-limited.',
  },

  // ── COMPLETE ────────────────────────────────────────────────────────────
  {
    id: 'complete', view: 'tools', placement: 'center',
    title: 'Tour complete',
    body: 'You\'ve seen every headline feature. The real portal is workspace-scoped per client with data pulled live from Microsoft Sentinel, Graph, and Defender.',
    cta: 'Restart',
  },
];

export function TourPopover({ step, stepIdx, total, onNext, onPrev, onSkip, onRestart, targetRect, onClose }) {
  const isCenter = step.placement === 'center';
  const isWelcome = step.id === 'welcome';
  const isComplete = step.id === 'complete';
  const popoverRef = useRef(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, arrow: null });

  useLayoutEffect(() => {
    if (isCenter || !targetRect || !popoverRef.current) return;
    const pop = popoverRef.current.getBoundingClientRect();
    const gap = 16;
    let top = 0, left = 0, arrow = null;
    switch (step.placement) {
      case 'top':
        top = targetRect.top - pop.height - gap;
        left = targetRect.left + targetRect.width / 2 - pop.width / 2;
        arrow = 'bottom';
        break;
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2 - pop.width / 2;
        arrow = 'top';
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - pop.height / 2;
        left = targetRect.left - pop.width - gap;
        arrow = 'right';
        break;
      case 'right':
      default:
        top = targetRect.top + targetRect.height / 2 - pop.height / 2;
        left = targetRect.right + gap;
        arrow = 'left';
        break;
    }
    const margin = 12;
    left = Math.max(margin, Math.min(left, window.innerWidth - pop.width - margin));
    top = Math.max(margin, Math.min(top, window.innerHeight - pop.height - margin));
    setPopoverPos({ top, left, arrow });
  }, [targetRect, step.id, step.placement, isCenter]);

  if (isCenter) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
        <div className="relative rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              {isWelcome ? 'Demo Tour' : isComplete ? 'Finished' : 'Step'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">{step.title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-300">
              {isWelcome ? 'Exit' : 'Close'}
            </button>
            <div className="flex items-center gap-2">
              {isComplete && (
                <button onClick={onRestart} className="px-3 py-2 text-xs font-medium rounded-md border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Restart
                </button>
              )}
              <button onClick={isWelcome ? onNext : isComplete ? onClose : onNext} className="px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
                {isWelcome ? <><Play className="w-3.5 h-3.5" /> {step.cta}</> : isComplete ? 'Close' : <>Next <ChevronRight className="w-3.5 h-3.5" /></>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const arrowPos = {
    top:    { bottom: -6, left: '50%', marginLeft: -6 },
    bottom: { top:    -6, left: '50%', marginLeft: -6 },
    left:   { right:  -6, top:  '50%', marginTop: -6 },
    right:  { left:   -6, top:  '50%', marginTop: -6 },
  }[popoverPos.arrow] || {};

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="fixed z-[120] w-80 rounded-xl border border-blue-500/40 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-2xl shadow-blue-500/10"
      style={{ top: popoverPos.top, left: popoverPos.left }}
    >
      <div
        className="absolute w-3 h-3 bg-slate-900 border-blue-500/40 rotate-45"
        style={{
          ...arrowPos,
          borderTopWidth:    popoverPos.arrow === 'top'    ? '1px' : 0,
          borderLeftWidth:   popoverPos.arrow === 'left'   ? '1px' : 0,
          borderRightWidth:  popoverPos.arrow === 'right'  ? '1px' : 0,
          borderBottomWidth: popoverPos.arrow === 'bottom' ? '1px' : 0,
          borderStyle: 'solid',
        }}
      />
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
          Step {stepIdx + 1} of {total}
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-200">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <h3 className="text-base font-bold text-slate-100 mb-1.5">{step.title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{step.body}</p>
      {step.advance === 'click' && (
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-400">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Click the highlighted element to continue
        </div>
      )}
      <div className="mt-4 flex items-center justify-between gap-2">
        <button onClick={onSkip} className="text-[11px] text-slate-500 hover:text-slate-300">Skip tour</button>
        <div className="flex items-center gap-1.5">
          <button onClick={onPrev} disabled={stepIdx === 0} className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" /> Back
          </button>
          {step.advance !== 'click' && (
            <button onClick={onNext} className="px-3 py-1 text-[11px] font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shadow-md shadow-blue-500/20">
              Next <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
