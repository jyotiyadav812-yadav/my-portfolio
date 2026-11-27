import { Save } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { RowActions, SectionCard, StringListCard } from '../components/EditorParts';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

const KEY = 'tools';

const DEFAULTS = {
  items: [],
  showcase_title: '',
  showcase_text: '',
  quote: '',
  chips: [],
};

function normalize(value) {
  return {
    ...DEFAULTS,
    ...value,
    items: Array.isArray(value.items) ? value.items : [],
    chips: Array.isArray(value.chips) ? value.chips : [],
  };
}

export default function Tools() {
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
        <h2 className="text-xl font-bold text-text">AI Tools</h2>
        <p className="text-sm text-muted mt-1">Tool names, descriptions, colors, logo images, and showcase text.</p>
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
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Showcase title</label>
            <input
              className="w-full px-3 py-2.5 border border-border rounded-lg"
              value={form.showcase_title ?? ''}
              onChange={(e) => update('showcase_title', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Showcase description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2.5 border border-border rounded-lg"
              value={form.showcase_text ?? ''}
              onChange={(e) => update('showcase_text', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Quote</label>
            <input
              className="w-full px-3 py-2.5 border border-border rounded-lg"
              value={form.quote ?? ''}
              onChange={(e) => update('quote', e.target.value)}
            />
          </div>
        </div>

        <StringListCard
          title="Showcase chips"
          items={form.chips}
          onAdd={() => update('chips', [...form.chips, ''])}
          onChange={(index, value) => {
            const chips = [...form.chips];
            chips[index] = value;
            update('chips', chips);
          }}
          onRemove={(index) => update('chips', form.chips.filter((_, i) => i !== index))}
        />

        <SectionCard
          title="Tools"
          onAdd={() => update('items', [...form.items, { name: '', description: '', color: '#8B5CF6', logo_url: '' }])}
        >
          {form.items.map((item, index) => (
            <div key={index} className="space-y-3 p-4 rounded-xl border border-border bg-surface">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <input
                  placeholder="Tool name"
                  className="md:col-span-4 px-3 py-2.5 border border-border rounded-lg bg-white"
                  value={item.name ?? ''}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                />
                <input
                  placeholder="Description"
                  className="md:col-span-5 px-3 py-2.5 border border-border rounded-lg bg-white"
                  value={item.description ?? ''}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
                <div className="md:col-span-3 flex items-center gap-2">
                  <input
                    type="color"
                    className="w-11 h-11 rounded cursor-pointer border border-border bg-white"
                    value={item.color || '#8B5CF6'}
                    onChange={(e) => updateItem(index, 'color', e.target.value)}
                    aria-label="Tool color"
                  />
                  <input
                    className="flex-1 min-w-0 px-2 py-2.5 border border-border rounded-lg bg-white text-sm"
                    value={item.color || ''}
                    onChange={(e) => updateItem(index, 'color', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <div className="w-40">
                  <ImageUpload label="Logo" value={item.logo_url} onChange={(v) => updateItem(index, 'logo_url', v)} />
                </div>
                <div className="ml-auto">
                  <RowActions
                    index={index}
                    length={form.items.length}
                    onMove={moveItem}
                    onRemove={() => update('items', form.items.filter((_, i) => i !== index))}
                  />
                </div>
              </div>
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
