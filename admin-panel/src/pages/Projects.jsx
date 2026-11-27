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

  if (loading) return <p className="text-sm text-muted">Loading projects...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Projects</h2>
        <p className="text-sm text-muted mt-1">Add projects with links, images, gradient cards, and emojis.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{form.id ? 'Edit project' : 'Add a project'}</h3>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              className="text-sm text-muted hover:text-text"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Title" required value={form.title} onChange={(v) => update('title', v)} />
          <Field label="Project link" value={form.link} placeholder="https://..." onChange={(v) => update('link', v)} />
        </div>
        <Field label="Description" textarea value={form.description} onChange={(v) => update('description', v)} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          <Field label="Card emoji" value={form.emoji} onChange={(v) => update('emoji', v)} />
          <Field label="Gradient colors" value={form.gradient} onChange={(v) => update('gradient', v)} />
          <Field label="Sort order" type="number" value={form.sort_order} onChange={(v) => update('sort_order', Number(v))} />
        </div>
        <ImageUpload label="Project image" value={form.image_url} onChange={(v) => update('image_url', v)} />

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover flex items-center gap-2"
        >
          <Save size={18} /> {saving ? 'Saving...' : form.id ? 'Update project' : 'Add project'}
        </button>
      </form>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface">
            <tr className="text-xs text-muted">
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3 hidden md:table-cell">Link</th>
              <th className="px-4 py-3 hidden lg:table-cell">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted">No projects yet.</td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr key={project.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {project.image_url ? (
                        <img src={project.image_url} alt="" className="w-12 h-12 rounded-lg object-cover border border-border" />
                      ) : (
                        <span
                          className="w-12 h-12 rounded-lg grid place-items-center text-xl shrink-0"
                          style={{ background: `linear-gradient(135deg, ${(project.gradient || '#8B5CF6,#67DDF5').split(',')[0]}, ${(project.gradient || '#8B5CF6,#67DDF5').split(',')[1] || '#67DDF5'})` }}
                        >
                          {project.emoji || '✦'}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text truncate">{project.title}</p>
                        <p className="text-xs text-muted truncate">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-lavender">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {project.link}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-muted">{project.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="p-2 text-muted hover:bg-surface rounded disabled:opacity-40" aria-label="Move up">
                        <ArrowUp size={16} />
                      </button>
                      <button type="button" onClick={() => move(index, 1)} disabled={index === projects.length - 1} className="p-2 text-muted hover:bg-surface rounded disabled:opacity-40" aria-label="Move down">
                        <ArrowDown size={16} />
                      </button>
                      <button type="button" onClick={() => startEdit(project)} className="p-2 text-lavender hover:bg-[#F3EDFF] rounded" aria-label="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" aria-label="Delete">
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
  );
}

function Field({ label, value, onChange, textarea, required, type = 'text', placeholder }) {
  const props = { value: value ?? '', onChange: (e) => onChange(e.target.value), required, placeholder };
  return (
    <label className="block">
      <span className="block text-sm font-medium text-muted mb-1.5">{label}</span>
      {textarea ? (
        <textarea rows={3} {...props} className="w-full px-3 py-2.5 border border-border rounded-lg" />
      ) : (
        <input type={type} {...props} className="w-full px-3 py-2.5 border border-border rounded-lg" />
      )}
    </label>
  );
}
