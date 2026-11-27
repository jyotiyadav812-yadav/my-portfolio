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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Account</h2>
        <p className="text-sm text-muted mt-1">Manage your admin login details.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-[#F3EDFF] grid place-items-center text-lavender shrink-0">
          <ShieldCheck size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted">Signed in as</p>
          <p className="text-sm font-medium text-text truncate">{user?.email || '—'}</p>
        </div>
      </div>

      <form onSubmit={handlePassword} className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound size={17} className="text-lavender" />
          <h3 className="text-sm font-semibold text-text">Change password</h3>
        </div>
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-muted mb-1.5">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            required
            autoComplete="new-password"
            className="w-full px-3 py-2.5 border border-border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-muted mb-1.5">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            autoComplete="new-password"
            className="w-full px-3 py-2.5 border border-border rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="px-5 py-2.5 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover inline-flex items-center gap-2"
        >
          <Save size={17} /> {savingPassword ? 'Saving...' : 'Update password'}
        </button>
      </form>

      <form onSubmit={handleEmail} className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Mail size={17} className="text-lavender" />
          <h3 className="text-sm font-semibold text-text">Change email</h3>
        </div>
        <div>
          <label htmlFor="new-email" className="block text-sm font-medium text-muted mb-1.5">
            New email address
          </label>
          <input
            id="new-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 border border-border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={savingEmail}
          className="px-5 py-2.5 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover inline-flex items-center gap-2"
        >
          <Save size={17} /> {savingEmail ? 'Saving...' : 'Update email'}
        </button>
        <p className="text-xs text-muted">
          A confirmation link is sent to the new address. Confirm it before removing the old email from Admins.
        </p>
      </form>
    </div>
  );
}
