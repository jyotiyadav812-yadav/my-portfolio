import { Save } from 'lucide-react';
import { RowActions, SectionCard } from '../components/EditorParts';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

const KEY = 'nav';
const DEFAULTS = { items: [] };

function normalize(value) {
  return { ...DEFAULTS, items: Array.isArray(value.items) ? value.items : [] };
}

export default function Nav() {
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
        <h2 className="text-xl font-bold text-text">Navigation</h2>
        <p className="text-sm text-muted mt-1">Menu labels, links, order, and visibility.</p>
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
        <SectionCard
          title="Menu items"
          onAdd={() => update('items', [...form.items, { label: '', url: '#', visible: true }])}
        >
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 rounded-lg border border-border bg-surface">
              <input
                placeholder="Label"
                className="md:col-span-4 px-3 py-2.5 border border-border rounded-lg bg-white"
                value={item.label ?? ''}
                onChange={(e) => updateItem(index, 'label', e.target.value)}
              />
              <input
                placeholder="#home or https://..."
                className="md:col-span-5 px-3 py-2.5 border border-border rounded-lg bg-white"
                value={item.url ?? ''}
                onChange={(e) => updateItem(index, 'url', e.target.value)}
              />
              <label className="md:col-span-1 flex items-center gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={item.visible !== false}
                  onChange={(e) => updateItem(index, 'visible', e.target.checked)}
                  className="w-4 h-4 accent-[#8B5CF6]"
                />
                Show
              </label>
              <div className="md:col-span-2">
                <RowActions
                  index={index}
                  length={form.items.length}
                  onMove={moveItem}
                  onRemove={() => update('items', form.items.filter((_, i) => i !== index))}
                />
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
