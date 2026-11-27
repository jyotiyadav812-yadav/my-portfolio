import { useEffect, useMemo, useState } from 'react';
import { Check, Inbox, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Toast from '../components/Toast';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) =>
      [m.name, m.email, m.message].some((value) => (value || '').toLowerCase().includes(q))
    );
  }, [messages, query]);

  const toggleRead = async (message) => {
    const { error: err } = await supabase
      .from('messages')
      .update({ read: !message.read })
      .eq('id', message.id);
    if (err) setToast({ kind: 'error', message: err.message });
    else load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const { error: err } = await supabase.from('messages').delete().eq('id', id);
    if (err) setToast({ kind: 'error', message: err.message });
    else {
      setToast({ kind: 'success', message: 'Message deleted.' });
      load();
    }
  };

  if (loading) return <p className="text-sm text-muted">Loading messages...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Messages</h2>
          <p className="text-sm text-muted mt-1">Contact form submissions from your portfolio.</p>
        </div>
        <input
          type="search"
          placeholder="Search messages..."
          className="px-3 py-2.5 border border-border rounded-lg w-full sm:w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {visible.length === 0 ? (
          <div className="p-10 text-center text-muted flex flex-col items-center gap-2">
            <Inbox size={28} />
            {messages.length === 0 ? 'No messages yet.' : 'No messages match your search.'}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((message) => (
              <li key={message.id} className={`p-5 ${message.read ? '' : 'bg-[#F8FAFF]'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-text">{message.name}</p>
                      {!message.read && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3EDFF] text-lavender">
                          New
                        </span>
                      )}
                    </div>
                    <a href={`mailto:${message.email}`} className="text-xs text-lavender hover:underline">
                      {message.email}
                    </a>
                    <p className="text-xs text-muted mt-1">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRead(message)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition ${
                        message.read
                          ? 'border-border text-muted hover:text-text'
                          : 'border-lavender text-lavender bg-[#F3EDFF]'
                      }`}
                    >
                      <Check size={14} /> {message.read ? 'Read' : 'Mark read'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(message.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      aria-label="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-text whitespace-pre-wrap mt-4">{message.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
