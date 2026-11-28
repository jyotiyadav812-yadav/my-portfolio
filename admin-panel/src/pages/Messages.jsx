import { useEffect, useMemo, useState } from 'react';
import { Check, Inbox, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Toast from '../components/Toast';
import { useDeleteGuard } from '../contexts/DeleteGuardContext';

export default function Messages() {
  const confirmDelete = useDeleteGuard();
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

  const handleDelete = async (message) => {
    const confirmed = await confirmDelete({
      title: 'Delete message',
      description: `Delete the message from ${message.name || message.email}? This cannot be undone. Enter your admin password to confirm.`,
    });
    if (!confirmed) return;
    const { error: err } = await supabase.from('messages').delete().eq('id', message.id);
    if (err) setToast({ kind: 'error', message: err.message });
    else {
      setToast({ kind: 'success', message: 'Message deleted.' });
      load();
    }
  };

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading messages...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Messages</h2>
          <p className="text-sm text-[#25243A]/60">Contact form submissions from your portfolio.</p>
        </div>
        <div className="relative z-10 block">
          <input
            type="search"
            placeholder="Search messages..."
            className="px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all w-full sm:w-72"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm shadow-sm">{error}</div>}

      <div className="glass rounded-3xl p-8 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
        {visible.length === 0 ? (
          <div className="p-12 text-center text-[#25243A]/50 flex flex-col items-center gap-3">
            <Inbox size={32} className="mx-auto mb-3" />
            {messages.length === 0 ? 'No messages yet.' : 'No messages match your search.'}
          </div>
        ) : (
          <ul className="divide-y divide-[#B69CFF]/20">
            {visible.map((message) => (
              <li key={message.id} className={`p-6 ${message.read ? '' : 'bg-[#F8FAFF]/50 rounded-xl'} group`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-[#25243A]">{message.name}</p>
                      {!message.read && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3EDFF] text-[#8B5CF6]">
                          New
                        </span>
                      )}
                    </div>
                    <a href={`mailto:${message.email}`} className="text-sm text-[#8B5CF6] hover:underline transition">
                      {message.email}
                    </a>
                    <p className="text-xs text-[#25243A]/50 mt-2 uppercase tracking-wider">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleRead(message)}
                      className={`flex items-center gap-2 px-3 py-2 text-xs rounded-xl border transition ${
                        message.read
                          ? 'border-[#B69CFF]/40 text-[#25243A]/60 hover:text-[#8B5CF6] hover:border-[#8B5CF6]'
                          : 'border-[#8B5CF6] text-[#8B5CF6] bg-[#F3EDFF]'
                      }`}
                    >
                      <Check size={14} /> {message.read ? 'Read' : 'Mark read'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(message)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                      aria-label="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[#25243A]/70 whitespace-pre-wrap mt-5 leading-relaxed">{message.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
