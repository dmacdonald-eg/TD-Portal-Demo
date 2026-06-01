import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RotateCcw } from 'lucide-react';

import { FakeHeader, FakeSidebar } from './environmentDemo/chrome';
import { STEPS, TourPopover } from './environmentDemo/tour';

import DashboardView      from './environmentDemo/views/Dashboard';
import IncidentsListView  from './environmentDemo/views/IncidentsList';
import IncidentDetailView from './environmentDemo/views/IncidentDetail';
import TicketsView        from './environmentDemo/views/Tickets';
import TicketDetailView   from './environmentDemo/views/TicketDetail';
import ReportsView        from './environmentDemo/views/Reports';
import HealthView         from './environmentDemo/views/Health';
import MailView           from './environmentDemo/views/Mail';
import IdentityView       from './environmentDemo/views/Identity';
import ThreatIntelView    from './environmentDemo/views/ThreatIntel';
import ToolsView          from './environmentDemo/views/Tools';

/* Standalone Client Portal demo. Fullscreen takeover with faithful chrome
   (top header + vertical sidebar) and a guided ~52-step tour walking through
   every marquee feature for live SA demos. */

const VIEW_COMPONENTS = {
  dashboard:         DashboardView,
  'incidents-list':  IncidentsListView,
  'incident-detail': IncidentDetailView,
  tickets:           TicketsView,
  'ticket-detail':   TicketDetailView,
  reports:           ReportsView,
  health:            HealthView,
  mail:              MailView,
  identity:          IdentityView,
  'threat-intel':    ThreatIntelView,
  tools:             ToolsView,
};

const ALL_MODULES = ['dashboard','incidents','tickets','health','mail','identity','threat-intel','reports','tools'];

export default function EnvironmentDemo({ onExit, modules, steps: stepWhitelist }) {
  // Filter the tour by module membership OR explicit step-ID whitelist, then
  // rewrite any go-* (sidebar nav) step's view to whatever view the previous
  // step left us on — keeps the "click X in the sidebar" prompt anchored to
  // a page that's actually being shown when sections are skipped.
  const tourSteps = useMemo(() => {
    const effectiveModules = modules || ALL_MODULES;
    const useWhitelist = Array.isArray(stepWhitelist);
    const allow = (s) => {
      if (useWhitelist) return stepWhitelist.includes(s.id);
      return !s.module || effectiveModules.includes(s.module);
    };
    const filtered = STEPS.filter(allow);
    let lastView = null;
    return filtered.map((s) => {
      const isGo = typeof s.id === 'string' && s.id.startsWith('go-');
      const isComplete = s.id === 'complete';
      if ((isGo || isComplete) && lastView && s.view !== lastView) {
        return { ...s, view: lastView };
      }
      if (s.view) lastView = s.view;
      return s;
    });
  }, [modules, stepWhitelist]);

  const [stepIdx, setStepIdx] = useState(0);
  const [tourActive, setTourActive] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [targetRect, setTargetRect] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mainRef = useRef(null);

  const step = tourSteps[stepIdx];

  // Sync the view to whatever the current step says
  useEffect(() => {
    if (step?.view) setCurrentView(step.view);
  }, [stepIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Find tour target with polling — handles view transitions where the DOM
  // briefly doesn't have the new view mounted yet.
  useEffect(() => {
    if (!step || step.placement === 'center' || !tourActive) {
      setTargetRect(null);
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40; // ~800ms — generous for tab transitions
    const tryFindTarget = () => {
      if (cancelled) return;
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        el.scrollIntoView({ block: 'center', inline: 'nearest' });
        requestAnimationFrame(() => {
          if (cancelled) return;
          const rect = el.getBoundingClientRect();
          setTargetRect({
            top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom,
            width: rect.width, height: rect.height,
          });
        });
        return;
      }
      if (++attempts < maxAttempts) setTimeout(tryFindTarget, 20);
      else setTargetRect(null);
    };
    setTargetRect(null);
    tryFindTarget();
    return () => { cancelled = true; };
  }, [stepIdx, currentView, tourActive]);

  // Reposition rect on window resize or main-area scroll
  useEffect(() => {
    if (!step?.target) return;
    const handler = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom,
          width: rect.width, height: rect.height,
        });
      }
    };
    window.addEventListener('resize', handler);
    const main = mainRef.current;
    if (main) main.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('resize', handler);
      if (main) main.removeEventListener('scroll', handler);
    };
  }, [step]);

  const handleNext    = useCallback(() => setStepIdx((i) => Math.min(i + 1, tourSteps.length - 1)), [tourSteps.length]);
  const handlePrev    = useCallback(() => setStepIdx((i) => Math.max(i - 1, 0)), []);
  const handleSkip    = useCallback(() => setTourActive(false), []);
  const handleRestart = useCallback(() => { setStepIdx(0); setTourActive(true); setCurrentView('dashboard'); }, []);
  const handleClose   = useCallback(() => {
    if (onExit) onExit();
    else window.location.reload();
  }, [onExit]);

  // Advance the tour if the current step is waiting for a click on this tour ID.
  // Used by sidebar nav, sub-tab buttons, incident rows, ticket rows, etc.
  const advanceIfTarget = useCallback((tourId) => {
    if (tourActive && step.advance === 'click' && step.target === tourId) {
      setStepIdx((i) => i + 1);
    }
  }, [step, tourActive]);

  const handleNavClick = useCallback((viewId, tourId) => {
    setCurrentView(viewId);
    advanceIfTarget(tourId);
  }, [advanceIfTarget]);

  const handleIncidentClick = useCallback(() => {
    setCurrentView('incident-detail');
    advanceIfTarget('incident-row-2847');
  }, [advanceIfTarget]);

  const handleTicketClick = useCallback(() => {
    setCurrentView('ticket-detail');
    advanceIfTarget('ticket-row-58472');
  }, [advanceIfTarget]);

  const handleBack = useCallback(() => {
    if (currentView === 'incident-detail') setCurrentView('incidents-list');
    else if (currentView === 'ticket-detail') setCurrentView('tickets');
  }, [currentView]);

  const ViewComponent = VIEW_COMPONENTS[currentView] || DashboardView;
  const showSpotlight = tourActive && targetRect && step.placement !== 'center';

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Demo banner */}
      <div className="shrink-0 flex items-center justify-between px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/30 text-[11px]">
        <div className="flex items-center gap-2 text-amber-300">
          <Sparkles className="w-3 h-3" />
          <span className="font-semibold">CLIENT PORTAL DEMO</span>
          <span className="text-amber-400/70">Synthetic data · "Acme Corp"</span>
        </div>
        <div className="flex items-center gap-3">
          {!tourActive && (
            <button onClick={handleRestart} className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium">
              <RotateCcw className="w-3 h-3" /> Restart tour
            </button>
          )}
          <button onClick={handleClose} className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium">
            <X className="w-3 h-3" /> Exit demo
          </button>
        </div>
      </div>

      <FakeHeader />

      <div className="flex flex-1 overflow-hidden">
        <FakeSidebar
          activeView={currentView}
          onNavClick={handleNavClick}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          modules={modules}
        />

        <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ViewComponent
                  onIncidentClick={handleIncidentClick}
                  onTicketClick={handleTicketClick}
                  onBack={handleBack}
                  onTourTargetClick={advanceIfTarget}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Tour overlay */}
      {tourActive && (
        <>
          {showSpotlight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="fixed pointer-events-none z-[110] rounded-lg"
              style={{
                top: targetRect.top - 6,
                left: targetRect.left - 6,
                width: targetRect.width + 12,
                height: targetRect.height + 12,
                boxShadow: '0 0 0 2px rgba(59,130,246,0.7), 0 0 0 8px rgba(59,130,246,0.15), 0 0 40px rgba(59,130,246,0.35), 0 0 0 9999px rgba(2,6,23,0.55)',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
          <AnimatePresence mode="wait">
            <TourPopover
              key={step.id}
              step={step}
              stepIdx={stepIdx}
              total={tourSteps.length}
              onNext={handleNext}
              onPrev={handlePrev}
              onSkip={handleSkip}
              onRestart={handleRestart}
              onClose={handleClose}
              targetRect={targetRect}
            />
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
