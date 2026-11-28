import { useEffect, useState } from 'react';
import { Plus, Save, Shield, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useDeleteGuard } from '../contexts/DeleteGuardContext';
import Toast from '../components/Toast';

export default function Admins() {
  const { user } = useAuth();
  const confirmDelete = useDeleteGuard();
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('admin_users')
      .select('email, created_at')
      .order('created_at', { ascending: true });
    if (err) setError(err.message);
    else setEmails(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('admin_users').insert({ email: newEmail.trim().toLowerCase() });
    setSaving(false);
    if (err) setToast({ kind: 'error', message: err.message });
    else {
      setNewEmail('');
      setToast({ kind: 'success', message: 'Admin access granted.' });
      load();
    }
  };

  const handleRemove = async (email) => {
    if (email === user?.email?.toLowerCase()) {
      setToast({ kind: 'error', message: 'You cannot remove your own admin access.' });
      return;
    }
    if (!(await confirmDelete({
      title: 'Remove admin access',
      description: `Remove admin access for ${email}? Enter your admin password to confirm.`,
      confirmLabel: 'Remove',
    }))) return;
    const { error: err } = await supabase.from('admin_users').delete().eq('email', email);
    if (err) setToast({ kind: 'error', message: err.message });
    else {
      setToast({ kind: 'success', message: 'Admin access removed.' });
      load();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Admins</h2>
        <p className="text-sm text-[#25243A]/60">Only these email addresses can sign in to this panel.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm shadow-sm">{error}</div>}

      <form onSubmit={handleAdd} className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden flex flex-col sm:flex-row gap-4">
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />
        <div className="relative z-10 flex-1 block">
          <input
            type="email"
            required
            placeholder="name@example.com"
            className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="relative z-10 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white rounded-2xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-[0_0_34px_rgba(139,92,246,.55)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} /> {saving ? 'Adding...' : 'Add admin'}
        </button>
      </form>

      <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#67DDF5]/15" />
        <div className="relative z-10 px-6 py-4 border-b border-[#B69CFF]/30 flex items-center gap-3">
          <Shield size={17} className="text-[#8B5CF6]" />
          <h3 className="text-sm font-bold text-[#25243A]">Authorized emails</h3>
        </div>
        {loading ? (
          <p className="p-8 text-sm text-[#25243A]/50 text-center">Loading admins...</p>
        ) : emails.length === 0 ? (
          <p className="p-8 text-sm text-[#25243A]/50 text-center">No admin accounts found.</p>
        ) : (
          <ul className="relative z-10 divide-y divide-[#B69CFF]/20">
            {emails.map((admin) => (
              <li key={admin.email} className="p-6 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-[#25243A] truncate">{admin.email}</p>
                  <p className="text-xs text-[#25243A]/50">
                    Added {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '—'}
                    {admin.email === user?.email ? ' · You' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(admin.email)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                  aria-label={`Remove ${admin.email}`}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-[#25243A]/50 uppercase tracking-wider">
        <Save size={14} className="text-[#8B5CF6]" />
        New admins must also have a Supabase Auth user with the same email and password.
      </div>
    </div>
  );
}
