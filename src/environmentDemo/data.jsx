/* All synthetic data + static constants used across demo views. */

export const TREND_14D = [
  { high: 1, medium: 2, low: 6,  info: 3 },
  { high: 0, medium: 3, low: 8,  info: 4 },
  { high: 2, medium: 4, low: 5,  info: 3 },
  { high: 1, medium: 2, low: 9,  info: 5 },
  { high: 0, medium: 1, low: 7,  info: 4 },
  { high: 1, medium: 3, low: 10, info: 6 },
  { high: 2, medium: 5, low: 12, info: 5 },
  { high: 1, medium: 4, low: 8,  info: 4 },
  { high: 0, medium: 3, low: 11, info: 6 },
  { high: 3, medium: 6, low: 13, info: 7 },
  { high: 1, medium: 4, low: 9,  info: 5 },
  { high: 2, medium: 5, low: 11, info: 6 },
  { high: 4, medium: 7, low: 14, info: 8 },
  { high: 3, medium: 5, low: 12, info: 7 },
];

export const INCIDENT_ROWS = [
  { num: 'INC-2847', title: 'Suspicious sign-in from anonymizing proxy',                sev: 'High',    status: 'Active', cls: 'Undetermined',   alerts: 1, ticket: '58472', analyst: 'unassigned',  age: '2h ago' },
  { num: 'INC-2846', title: 'Possible AiTM phishing — sarah.chen@acme.com',             sev: 'High',    status: 'Active', cls: 'Undetermined',   alerts: 2, ticket: '58471', analyst: 'mike.k',      age: '3h ago' },
  { num: 'INC-2845', title: 'Mass file deletion on FILE-SRV-01',                        sev: 'Medium',  status: 'New',    cls: 'Undetermined',   alerts: 1, ticket: '',      analyst: 'unassigned',  age: '5h ago' },
  { num: 'INC-2844', title: 'Defender uncommon process — powershell.exe child',         sev: 'Low',     status: 'Closed', cls: 'FalsePositive',  alerts: 1, ticket: '58465', analyst: 'jenna.r',     age: '8h ago' },
  { num: 'INC-2843', title: 'New global admin role assignment outside change window',   sev: 'High',    status: 'Closed', cls: 'TruePositive',   alerts: 1, ticket: '58460', analyst: 'mike.k',      age: '1d ago' },
  { num: 'INC-2842', title: 'Impossible travel — liam.park@acme.com',                   sev: 'Medium',  status: 'Closed', cls: 'BenignPositive', alerts: 1, ticket: '58458', analyst: 'jenna.r',     age: '1d ago' },
  { num: 'INC-2841', title: 'Multiple failed sign-ins followed by success',             sev: 'Medium',  status: 'Closed', cls: 'FalsePositive',  alerts: 3, ticket: '58455', analyst: 'tom.s',       age: '2d ago' },
  { num: 'INC-2840', title: 'Defender — credential dumping (LSASS access)',             sev: 'High',    status: 'Closed', cls: 'TruePositive',   alerts: 1, ticket: '58450', analyst: 'mike.k',      age: '2d ago' },
];

export const REPORT_FILES = [
  { name: 'Acme - Identity Risk - 2026-05.pdf',      type: 'identity-risk', period: '2026-05', date: 'May 20, 2026',  size: '1.4 MB' },
  { name: 'Acme - Identity Risk - 2026-04.pdf',      type: 'identity-risk', period: '2026-04', date: 'Apr 15, 2026',  size: '1.3 MB' },
  { name: 'Acme - Vulnerability - 2026-05.pdf',      type: 'vulnerability', period: '2026-05', date: 'May 1, 2026',   size: '2.1 MB' },
  { name: 'Acme - Vulnerability - 2026-04.pdf',      type: 'vulnerability', period: '2026-04', date: 'Apr 1, 2026',   size: '2.0 MB' },
  { name: 'Acme - Secure Score - 2026-Q2.pdf',       type: 'secure-score',  period: '2026-Q2', date: 'Apr 1, 2026',   size: '0.9 MB' },
  { name: 'Acme - Secure Score - 2026-Q1.pdf',       type: 'secure-score',  period: '2026-Q1', date: 'Jan 1, 2026',   size: '0.9 MB' },
];

export const REPORT_BADGE = {
  'identity-risk': { cls: 'bg-blue-900/20 border-blue-800/50 text-blue-400',    label: 'Identity Risk' },
  'vulnerability': { cls: 'bg-amber-900/20 border-amber-800/50 text-amber-400', label: 'Vulnerability' },
  'secure-score':  { cls: 'bg-green-900/20 border-green-800/50 text-green-400', label: 'Secure Score' },
};

export const TICKETS = [
  { num: 58472, title: 'INC-2847 — Suspicious sign-in from anonymizing proxy',  pri: 'P1', status: 'In Progress',     owner: 'mike.k',  type: 'Incident', age: '2h ago' },
  { num: 58471, title: 'INC-2846 — Possible AiTM phishing',                      pri: 'P1', status: 'In Progress',     owner: 'mike.k',  type: 'Incident', age: '3h ago' },
  { num: 58468, title: 'Request: Onboard new analyst account',                   pri: 'P3', status: 'Awaiting Client', owner: 'jenna.r', type: 'Request',  age: '6h ago' },
  { num: 58465, title: 'INC-2844 — Defender uncommon process',                   pri: 'P3', status: 'Resolved',        owner: 'jenna.r', type: 'Incident', age: '8h ago' },
  { num: 58460, title: 'INC-2843 — New global admin role assignment',            pri: 'P1', status: 'Resolved',        owner: 'mike.k',  type: 'Incident', age: '1d ago' },
  { num: 58458, title: 'INC-2842 — Impossible travel',                           pri: 'P2', status: 'Resolved',        owner: 'jenna.r', type: 'Incident', age: '1d ago' },
];
