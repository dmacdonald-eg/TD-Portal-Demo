import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, AlertTriangle, Ticket, FileText, HeartPulse, Mail, Fingerprint,
  Globe, Wrench, ChevronRight, ChevronLeft, Search, Bell, Command, LogOut,
} from 'lucide-react';

/* Faithful recreations of the real portal's top header (Layout.jsx) and
   left sidebar (Sidebar.jsx). Standalone — no real navigation, just visual. */

export const NAV_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',       icon: LayoutDashboard, tour: 'nav-dashboard' },
  { id: 'incidents-list', label: 'Incidents',       icon: AlertTriangle,   tour: 'nav-incidents' },
  { id: 'tickets',        label: 'Tickets',         icon: Ticket,          tour: 'nav-tickets' },
  { id: 'reports',        label: 'Reports',         icon: FileText,        tour: 'nav-reports' },
  { id: 'health',         label: 'Sentinel Health', icon: HeartPulse,      tour: 'nav-health' },
  { id: 'mail',           label: 'Mail Hygiene',    icon: Mail,            tour: 'nav-mail' },
  { id: 'identity',       label: 'Identity',        icon: Fingerprint,     tour: 'nav-identity' },
  { id: 'threat-intel',   label: 'Threat Intel',    icon: Globe,           tour: 'nav-threatintel' },
  { id: 'tools',          label: 'Tools',           icon: Wrench,          tour: 'nav-tools' },
];

export const SIDEBAR_COLLAPSED = 64;
export const SIDEBAR_EXPANDED  = 240;

export function FakeHeader() {
  const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().includes('MAC');
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shrink-0">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/ThreatDefender.png" alt="ThreatDefender" className="h-8" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <span className="text-sm text-slate-400 border-l border-slate-700 pl-3 ml-1">Acme Corp</span>
          </div>

          <div className="flex items-center gap-1">
            {[
              { v: '24h', label: '24h' },
              { v: '7d',  label: '7 Days' },
              { v: '30d', label: '30 Days' },
              { v: '90d', label: '90 Days' },
            ].map((tr) => (
              <span
                key={tr.v}
                className={`px-2 py-1 text-[11px] rounded-md border ${
                  tr.v === '7d'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
              >
                {tr.label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400">
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs">Search</span>
              <kbd className="ml-1.5 flex items-center gap-0.5 text-[10px] text-slate-500 bg-slate-900/80 border border-slate-700 rounded px-1.5 py-0.5">
                {isMac ? <Command className="w-2.5 h-2.5" /> : 'Ctrl+'}K
              </kbd>
            </button>
            <Bell className="w-4 h-4 text-slate-500" />
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white">SC</div>
            <div className="hidden sm:block text-right">
              <div className="text-sm text-slate-200 leading-tight">Sarah Chen</div>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white ml-2 px-2 py-1 rounded hover:bg-slate-800">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function FakeSidebar({ activeView, onNavClick, collapsed, onToggle }) {
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
  return (
    <motion.aside
      initial={false}
      animate={{ width }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="shrink-0 bg-slate-900/95 border-r border-slate-800 backdrop-blur-sm flex flex-col overflow-hidden"
      style={{ width }}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-end pr-2'} py-2`}>
        <button
          onClick={onToggle}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id ||
            (item.id === 'incidents-list' && (activeView === 'incident-detail')) ||
            (item.id === 'tickets' && activeView === 'ticket-detail');
          const activeCls = 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400';
          const inactiveCls = 'text-slate-400 hover:text-white hover:bg-slate-800/60 border-l-2 border-transparent';

          if (collapsed) {
            return (
              <div key={item.id} className="relative group">
                <button
                  data-tour={item.tour}
                  onClick={() => onNavClick(item.id, item.tour)}
                  className={`flex items-center justify-center w-full h-10 rounded-lg transition-colors ${isActive ? activeCls : inactiveCls}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                </button>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50 pointer-events-none">
                  <div className="bg-slate-800 border border-slate-700 rounded-md shadow-lg px-2.5 py-1 text-xs text-slate-200 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              data-tour={item.tour}
              onClick={() => onNavClick(item.id, item.tour)}
              className={`flex items-center gap-3 w-full px-3 h-10 rounded-lg transition-colors text-sm font-medium ${isActive ? activeCls : inactiveCls}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-left truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={`border-t border-slate-800 py-2 ${collapsed ? 'px-2' : 'px-3'}`}>
        {collapsed ? (
          <div className="flex items-center justify-center w-full h-10 rounded-lg text-slate-600">
            <span className="text-[10px] font-bold">eG</span>
          </div>
        ) : (
          <div className="px-3 py-1.5 text-[10px] text-slate-600 leading-tight">
            Powered by eGroup Enabling Technologies
          </div>
        )}
      </div>
    </motion.aside>
  );
}
