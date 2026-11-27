import { useEffect, useState } from 'react';
import { Plus, Save, Shield, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

export default function Admins() {
  const { user } = useAuth();
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
    if (!window.confirm(`Remove admin access for ${email}?`)) return;
    const { error: err } = await supabase.from('admin_users').delete().eq('email', email);
    if (err) setToast({ kind: 'error', message: err.message });
    else {
      setToast({ kind: 'success', message: 'Admin access removed.' });
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Admins</h2>
        <p className="text-sm text-muted mt-1">Only these email addresses can sign in to this panel.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>}

      <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="name@example.com"
          className="flex-1 px-3 py-2.5 border border-border rounded-lg"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover flex items-center justify-center gap-2"
        >
          <Plus size={18} /> {saving ? 'Adding...' : 'Add admin'}
        </button>
      </form>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Shield size={17} className="text-lavender" />
          <h3 className="text-sm font-semibold text-text">Authorized emails</h3>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading admins...</p>
        ) : emails.length === 0 ? (
          <p className="p-6 text-sm text-muted">No admin accounts found.</p>
        ) : (
          <ul className="divide-y divide-border">
            {emails.map((admin) => (
              <li key={admin.email} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text truncate">{admin.email}</p>
                  <p className="text-xs text-muted">
                    Added {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '—'}
                    {admin.email === user?.email ? ' · You' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(admin.email)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  aria-label={`Remove ${admin.email}`}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted">
        <Save size={14} /> New admins must also have a Supabase Auth user with the same email and password.
      </div>
    </div>
  );
}
