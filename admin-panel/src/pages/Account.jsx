import { useState } from 'react';
import { KeyRound, Mail, Save, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

export default function Account() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [toast, setToast] = useState(null);

  const handlePassword = async (e) => {
    e.preventDefault();
    setToast(null);
    if (password.length < 6) {
      setToast({ kind: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ kind: 'error', message: 'Passwords do not match.' });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) setToast({ kind: 'error', message: error.message });
    else {
      setPassword('');
      setConfirmPassword('');
      setToast({ kind: 'success', message: 'Password updated.' });
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setToast(null);
    const nextEmail = email.trim().toLowerCase();
    if (nextEmail === user?.email?.toLowerCase()) {
      setToast({ kind: 'error', message: 'That is already your email address.' });
      return;
    }
    setSavingEmail(true);
    const { error: allowError } = await supabase.from('admin_users').insert({ email: nextEmail });
    if (allowError) {
      setSavingEmail(false);
      setToast({ kind: 'error', message: allowError.message });
      return;
    }
    const { error } = await supabase.auth.updateUser({ email: nextEmail });
    setSavingEmail(false);
    if (error) setToast({ kind: 'error', message: error.message });
    else {
      setEmail('');
      setToast({
        kind: 'success',
        message: 'Confirm the new address via email, then remove the old one from Admins.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Account</h2>
        <p className="text-sm text-[#25243A]/60">Manage your admin login details.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />

      <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm flex items-center gap-4 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />
        <span className="relative z-10 w-12 h-12 rounded-full bg-[#F3EDFF] grid place-items-center text-[#8B5CF6] shrink-0 shadow-lg shadow-purple-300/40">
          <ShieldCheck size={24} />
        </span>
        <div className="relative z-10 min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]/70">Signed in as</p>
          <p className="text-base font-bold text-[#25243A] truncate">{user?.email || '—'}</p>
        </div>
      </div>

      <form onSubmit={handlePassword} className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden space-y-5">
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#67DDF5]/15" />
        <div className="relative z-10 flex items-center gap-3 mb-1">
          <KeyRound size={17} className="text-[#8B5CF6]" />
          <h3 className="text-sm font-bold text-[#25243A]">Change password</h3>
        </div>
        <div className="relative z-10 block">
          <label htmlFor="new-password" className="block text-sm font-medium text-[#25243A]/60 mb-2">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            required
            autoComplete="new-password"
            className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="relative z-10 block">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-[#25243A]/60 mb-2">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            autoComplete="new-password"
            className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="relative z-10 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white rounded-2xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-[0_0_34px_rgba(139,92,246,.55)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
        >
          <Save size={17} /> {savingPassword ? 'Saving...' : 'Update password'}
        </button>
      </form>

      <form onSubmit={handleEmail} className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden space-y-5">
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#B69CFF]/15" />
        <div className="relative z-10 flex items-center gap-3 mb-1">
          <Mail size={17} className="text-[#B69CFF]" />
          <h3 className="text-sm font-bold text-[#25243A]">Change email</h3>
        </div>
        <div className="relative z-10 block">
          <label htmlFor="new-email" className="block text-sm font-medium text-[#25243A]/60 mb-2">
            New email address
          </label>
          <input
            id="new-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={savingEmail}
          className="relative z-10 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white rounded-2xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-[0_0_34px_rgba(139,92,246,.55)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
        >
          <Save size={17} /> {savingEmail ? 'Saving...' : 'Update email'}
        </button>
        <p className="relative z-10 text-xs text-[#25243A]/50 uppercase tracking-wider mt-3">
          A confirmation link is sent to the new address. Confirm it before removing the old email from Admins.
        </p>
      </form>
    </div>
  );
}
