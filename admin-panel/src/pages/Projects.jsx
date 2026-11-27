import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Edit2, Save, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';

const EMPTY = {
  title: '',
  description: '',
  link: '',
  image_url: '',
  gradient: '#8B5CF6,#67DDF5',
  emoji: '✦',
  sort_order: 0,
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title: form.title,
      description: form.description,
      link: form.link,
      image_url: form.image_url,
      gradient: form.gradient,
      emoji: form.emoji,
      sort_order: form.sort_order || projects.length + 1,
    };

    const { error: err } = form.id
      ? await supabase.from('projects').update(payload).eq('id', form.id)
      : await supabase.from('projects').insert([payload]);
    setSaving(false);

    if (err) setToast({ kind: 'error', message: err.message });
    else {
      setForm(EMPTY);
      setToast({ kind: 'success', message: form.id ? 'Project updated.' : 'Project added.' });
      load();
    }
  };

  const startEdit = (project) => setForm({ ...project });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const { error: err } = await supabase.from('projects').delete().eq('id', id);
    if (err) setToast({ kind: 'error', message: err.message });
    else {
      if (form.id === id) setForm(EMPTY);
      setToast({ kind: 'success', message: 'Project deleted.' });
      load();
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    const results = await Promise.all(
      next.map((project, i) => supabase.from('projects').update({ sort_order: i + 1 }).eq('id', project.id))
    );
    const failed = results.find((result) => result.error);
    if (failed) {
      setToast({ kind: 'error', message: failed.error.message });
      load();
    }
  };

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading projects...</p>;

  const getGradientColors = (gradient) => {
    const parts = (gradient || '#8B5CF6,#67DDF5').split(',');
    return parts.length >= 2 ? parts : ['#8B5CF6', '#67DDF5'];
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Projects</h2>
        <p className="text-sm text-[#25243A]/60">Add projects with links, images, gradient cards, and emojis.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm shadow-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden space-y-6">
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />
        <div className="relative z-10 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6]">{form.id ? 'Edit project' : 'Add a project'}</h3>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              className="text-xs font-medium text-[#25243A]/60 hover:text-[#8B5CF6] transition"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Title" required value={form.title} onChange={(v) => update('title', v)} />
          <Field label="Project link" value={form.link} placeholder="https://..." onChange={(v) => update('link', v)} />
        </div>
        <div className="relative z-10 block">
          <Field label="Description" textarea value={form.description} onChange={(v) => update('description', v)} />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <Field label="Card emoji" value={form.emoji} onChange={(v) => update('emoji', v)} />
          <Field label="Gradient colors" value={form.gradient} placeholder="#8B5CF6,#67DDF5" onChange={(v) => update('gradient', v)} />
          <Field label="Sort order" type="number" value={form.sort_order} onChange={(v) => update('sort_order', Number(v))} />
        </div>
        <div className="relative z-10 block">
          <ImageUpload label="Project image" value={form.image_url} onChange={(v) => update('image_url', v)} />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="relative z-10 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white rounded-2xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-[0_0_34px_rgba(139,92,246,.55)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
        >
          <Save size={18} /> {saving ? 'Saving...' : form.id ? 'Update project' : 'Add project'}
        </button>
      </form>

      <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#67DDF5]/15" />
        <div className="relative z-10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F8F7FF]/50">
              <tr className="text-xs font-bold text-[#25243A]/60 uppercase tracking-wider">
                <th className="px-4 py-4">Project</th>
                <th className="px-4 py-4 hidden md:table-cell">Link</th>
                <th className="px-4 py-4 hidden lg:table-cell">Order</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#25243A]/50">No projects yet.</td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <tr key={project.id} className="border-t border-[#B69CFF]/20">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        {project.image_url ? (
                          <img src={project.image_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#B69CFF]/30" />
                        ) : (
                          <span
                            className="w-12 h-12 rounded-xl grid place-items-center text-xl shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${getGradientColors(project.gradient)[0]}, ${getGradientColors(project.gradient)[1]})`,
                            }}
                          >
                            {project.emoji || '✦'}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#25243A] truncate">{project.title}</p>
                          <p className="text-xs text-[#25243A]/50 truncate">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-xs text-[#8B5CF6]">
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[#67DDF5] transition">
                          {project.link}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-sm text-[#25243A]/50">{project.sort_order}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="p-2 text-[#25243A]/40 hover:bg-[#F8F7FF] rounded-xl disabled:opacity-40 transition" aria-label="Move up">
                          <ArrowUp size={16} />
                        </button>
                        <button type="button" onClick={() => move(index, 1)} disabled={index === projects.length - 1} className="p-2 text-[#25243A]/40 hover:bg-[#F8F7FF] rounded-xl disabled:opacity-40 transition" aria-label="Move down">
                          <ArrowDown size={16} />
                        </button>
                        <button type="button" onClick={() => startEdit(project)} className="p-2 text-[#8B5CF6] hover:bg-[#F3EDFF] rounded-xl transition" aria-label="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button type="button" onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition" aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
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

function Field({ label, value, onChange, textarea, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[#25243A]/60 mb-2">{label}</span>
      {textarea ? (
        <textarea rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all" />
      ) : (
        <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all" />
      )}
    </label>
  );
}
