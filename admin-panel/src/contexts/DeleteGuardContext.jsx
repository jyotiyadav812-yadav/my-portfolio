import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Lock, ShieldAlert, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const DeleteGuardContext = createContext(null);

export function useDeleteGuard() {
  const ctx = useContext(DeleteGuardContext);
  if (!ctx) throw new Error('useDeleteGuard must be used within DeleteGuardProvider');
  return ctx;
}

export function DeleteGuardProvider({ children }) {
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const inputRef = useRef(null);
  const resolveRef = useRef(null);

  const confirmDelete = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setPassword('');
      setError('');
      setChecking(false);
      setRequest({
        title: options.title || 'Confirm deletion',
        description:
          options.description ||
          'This action cannot be undone. Enter your admin password to continue.',
        confirmLabel: options.confirmLabel || 'Delete',
      });
    });
  }, []);

  const close = useCallback((result) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setRequest(null);
    setPassword('');
    setError('');
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!request) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (event) => {
      if (event.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [request, close]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checking) return;
    if (!user?.email) {
      setError('No admin session found. Please sign in again.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setChecking(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (authError) {
      setChecking(false);
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Incorrect password. Please try again.'
          : authError.message
      );
      return;
    }

    close(true);
  };

  return (
    <DeleteGuardContext.Provider value={confirmDelete}>
      {children}
      {request && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => close(false)}
            className="absolute inset-0 bg-[#25243A]/40 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#B69CFF]/40 bg-white p-7 shadow-[0_25px_60px_-15px_rgba(139,92,246,.45)]">
            <button
              type="button"
              onClick={() => close(false)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-[#25243A]/40 hover:bg-[#F8F7FF] hover:text-[#25243A] transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-500">
                <ShieldAlert size={22} />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[#25243A]">{request.title}</h3>
                <p className="mt-1 text-sm text-[#25243A]/60 leading-relaxed">{request.description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]/70">
                  <Lock size={13} /> Admin password
                </span>
                <input
                  ref={inputRef}
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your login password"
                  className="w-full rounded-2xl border border-[#B69CFF]/40 bg-white/80 px-4 py-3 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={checking}
                />
              </label>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => close(false)}
                  disabled={checking}
                  className="rounded-xl border border-[#B69CFF]/40 px-5 py-2.5 text-sm font-semibold text-[#25243A]/70 hover:bg-[#F8F7FF] transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={checking}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-[#FF7A9C] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-200 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                >
                  {checking ? 'Verifying...' : request.confirmLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DeleteGuardContext.Provider>
  );
}
