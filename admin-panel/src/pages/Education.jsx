import { Save } from 'lucide-react';
import { RowActions, SectionCard } from '../components/EditorParts';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

const KEY = 'education';

const DEFAULTS = {
  intro: '',
  items: [],
};

function normalize(value) {
  return {
    ...DEFAULTS,
    ...value,
    items: Array.isArray(value.items) ? value.items : [],
  };
}

export default function Education() {
  const { form, setForm, loading, saving, error, toast, setToast, save } = useSiteContent(KEY, DEFAULTS, normalize);

  const update = (field, value) => setForm({ ...form, [field]: value });
  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    update('items', items);
  };
  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= form.items.length) return;
    const items = [...form.items];
    [items[index], items[target]] = [items[target], items[index]];
    update('items', items);
  };

  if (loading) return <p className="text-sm text-muted">Loading content...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Education</h2>
        <p className="text-sm text-muted mt-1">Timeline entries, scores, tags, and emojis. Leave score empty for “NOW”.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await save();
        }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <label className="block text-sm font-medium text-muted mb-1.5">Section intro</label>
          <input
            className="w-full px-3 py-2.5 border border-border rounded-lg"
            value={form.intro ?? ''}
            onChange={(e) => update('intro', e.target.value)}
          />
        </div>

        <SectionCard
          title="Timeline entries"
          onAdd={() =>
            update('items', [
              ...form.items,
              { title: '', place: '', year: '', score: null, tag: '', tagline: '', emoji: '✦', icon: '✦', grow: '🌱', chips: [] },
            ])
          }
        >
          {form.items.map((item, index) => (
            <div key={index} className="space-y-3 p-4 rounded-xl border border-border bg-surface">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <Input className="md:col-span-3" label="Title" value={item.title} onChange={(v) => updateItem(index, 'title', v)} />
                <Input className="md:col-span-3" label="School / place" value={item.place} onChange={(v) => updateItem(index, 'place', v)} />
                <Input className="md:col-span-2" label="Year" value={item.year} onChange={(v) => updateItem(index, 'year', v)} />
                <Input
                  className="md:col-span-2"
                  label="Score (%)"
                  type="number"
                  step="0.1"
                  value={item.score ?? ''}
                  onChange={(v) => updateItem(index, 'score', v === '' ? null : Number(v))}
                />
                <div className="md:col-span-2 flex items-end justify-end">
                  <RowActions
                    index={index}
                    length={form.items.length}
                    onMove={moveItem}
                    onRemove={() => update('items', form.items.filter((_, i) => i !== index))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <Input className="md:col-span-3" label="Tag" value={item.tag} onChange={(v) => updateItem(index, 'tag', v)} />
                <Input className="md:col-span-3" label="Tagline" value={item.tagline} onChange={(v) => updateItem(index, 'tagline', v)} />
                <Input className="md:col-span-2" label="Emoji" value={item.emoji} onChange={(v) => updateItem(index, 'emoji', v)} />
                <Input className="md:col-span-2" label="Badge icon" value={item.icon} onChange={(v) => updateItem(index, 'icon', v)} />
                <Input className="md:col-span-2" label="Plant emoji" value={item.grow} onChange={(v) => updateItem(index, 'grow', v)} />
              </div>
              <Input
                label="Chips (comma separated)"
                value={(item.chips || []).join(', ')}
                onChange={(v) =>
                  updateItem(
                    index,
                    'chips',
                    v.split(',').map((chip) => chip.trim()).filter(Boolean)
                  )
                }
              />
            </div>
          ))}
        </SectionCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover flex items-center gap-2"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs text-muted mb-1">{label}</span>
      <input
        {...props}
        className="w-full px-3 py-2.5 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lavender"
      />
    </label>
  );
}
