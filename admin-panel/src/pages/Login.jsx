import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (!authLoading && user && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await login(email.trim(), password);
      if (err) setError(err.message || 'Unable to sign in. Check your email and password.');
      else navigate('/admin', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-lavender to-cyan grid place-items-center text-white font-bold">
            JY
          </span>
          <div>
            <p className="font-bold text-text">Portfolio Admin</p>
            <p className="text-xs text-muted">Secure content management</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-7 sm:p-9">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={20} className="text-lavender" />
            <h1 className="text-xl font-bold text-text">Sign in to continue</h1>
          </div>

          <div className="min-h-[3.25rem] mb-2" aria-live="polite">
            {error && (
              <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-11 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 w-11 grid place-items-center text-muted hover:text-text"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 inline-flex items-center justify-center px-4 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Access is restricted to authorized admin accounts only.
        </p>
      </div>
    </div>
  );
}
