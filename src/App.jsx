import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import LoginGate from './LoginGate';

// Demo loads only after the session check passes, so the experience isn't
// rendered for visitors who haven't entered the shared credentials.
const EnvironmentDemo = lazy(() => import('./EnvironmentDemo'));

function Splash() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-400">
        <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
        <span className="text-sm">Loading demo…</span>
      </div>
    </div>
  );
}

export default function App() {
  const [status, setStatus] = useState('checking'); // checking | locked | unlocked
  // Scope for the logged-in user — null until /api/session resolves. `steps`
  // may be the string "all" (full tour) or an array of step ids (curated).
  const [scope, setScope] = useState({ modules: null, steps: 'all' });

  const loadSession = () => {
    return fetch('/api/session', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((d) => {
        if (d.authenticated) {
          setScope({ modules: d.modules || null, steps: d.steps ?? 'all' });
          setStatus('unlocked');
        } else {
          setStatus('locked');
        }
      })
      .catch(() => setStatus('locked'));
  };

  useEffect(() => { loadSession(); }, []);

  if (status === 'checking') return <Splash />;
  if (status === 'locked') return <LoginGate onSuccess={loadSession} />;

  return (
    <Suspense fallback={<Splash />}>
      <EnvironmentDemo
        onExit={() => window.location.reload()}
        modules={scope.modules}
        steps={scope.steps}
      />
    </Suspense>
  );
}
