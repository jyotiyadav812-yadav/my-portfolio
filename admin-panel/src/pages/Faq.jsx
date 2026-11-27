import { Save } from 'lucide-react';
import { RowActions, SectionCard } from '../components/EditorParts';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

const KEY = 'faq';

const DEFAULTS = { items: [] };

function normalize(value) {
  return { ...DEFAULTS, items: Array.isArray(value.items) ? value.items : [] };
}

export default function Faq() {
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
        <h2 className="text-xl font-bold text-text">FAQ</h2>
        <p className="text-sm text-muted mt-1">Questions and answers shown in the FAQ accordion.</p>
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
          title="FAQ items"
          onAdd={() => update('items', [...form.items, { icon: '✦', question: '', answer: '' }])}
        >
          {form.items.map((item, index) => (
            <div key={index} className="space-y-3 p-4 rounded-xl border border-border bg-surface">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <input
                  placeholder="Icon"
                  className="md:col-span-2 px-3 py-2.5 border border-border rounded-lg bg-white"
                  value={item.icon ?? ''}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                />
                <input
                  placeholder="Question"
                  className="md:col-span-8 px-3 py-2.5 border border-border rounded-lg bg-white"
                  value={item.question ?? ''}
                  onChange={(e) => updateItem(index, 'question', e.target.value)}
                />
                <div className="md:col-span-2 pt-1">
                  <RowActions
                    index={index}
                    length={form.items.length}
                    onMove={moveItem}
                    onRemove={() => update('items', form.items.filter((_, i) => i !== index))}
                  />
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="Answer"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-white"
                value={item.answer ?? ''}
                onChange={(e) => updateItem(index, 'answer', e.target.value)}
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
