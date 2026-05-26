import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Loader2 } from 'lucide-react';

export default function LoginGate({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        onSuccess();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Invalid username or password.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 dot-field opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-6 justify-center">
          <img src="/ThreatDefender.png" alt="ThreatDefender" className="w-9 h-9 rounded-lg" />
          <div className="text-left">
            <div className="text-sm font-semibold text-white leading-tight">ThreatDefender</div>
            <div className="text-[11px] text-slate-500 leading-tight">Client Portal — Demo</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-7 shadow-2xl">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-blue-400" />
            <h1 className="text-lg font-bold text-slate-100">Restricted demo</h1>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Enter the credentials you were provided to launch the interactive product tour.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Username</label>
              <input
                type="text"
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !username || !password}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Enter demo</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-5">
          Synthetic data only · No production systems are accessible from this demo.
        </p>
      </motion.div>
    </div>
  );
}
