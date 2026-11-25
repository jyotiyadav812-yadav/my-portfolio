import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin, adminLoading, logout } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: '', title: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    fetchNotices();
  }, [isAdmin]);

  const fetchNotices = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setNotices(data || []);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    if (form.id) {
      const { error: err } = await supabase
        .from('notices')
        .update({ title: form.title, description: form.description })
        .eq('id', form.id);
      if (err) setError(err.message);
    } else {
      const { error: err } = await supabase
        .from('notices')
        .insert([{ title: form.title, description: form.description }]);
      if (err) setError(err.message);
    }
    setForm({ id: '', title: '', description: '' });
    setSaving(false);
    fetchNotices();
  };

  const handleEdit = (n) => setForm({ id: n.id, title: n.title, description: n.description });

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    const { error: err } = await supabase.from('notices').delete().eq('id', id);
    if (err) setError(err.message);
    fetchNotices();
  };

  if (adminLoading || (!user && loading)) {
    return <div className="p-4 text-center">Checking admin access...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You are not authorized to view the admin panel.</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notices</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSave} className="mb-6 bg-white p-5 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-bold">{form.id ? 'Edit Notice' : 'Add Notice'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Title"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              required
              placeholder="Description"
              rows={3}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : form.id ? 'Update' : 'Add'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm({ id: '', title: '', description: '' })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
            >
              Cancel
            </button>
          )}
        </form>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading notices...</td></tr>
              ) : notices.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No notices found.</td></tr>
              ) : (
                notices.map((n) => (
                  <tr key={n.id} className="border-b">
                    <td className="px-4 py-3">{n.title}</td>
                    <td className="px-4 py-3">{n.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(n.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right gap-2">
                      <button onClick={() => handleEdit(n)} className="text-indigo-600 hover:underline text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(n.id)} className="text-red-600 hover:underline text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
