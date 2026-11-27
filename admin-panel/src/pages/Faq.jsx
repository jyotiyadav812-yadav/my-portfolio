import { Save } from 'lucide-react';
import Toast from '../components/Toast';
import { RowActions } from '../components/EditorParts';
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

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading content...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">FAQ</h2>
        <p className="text-sm text-[#25243A]/60">Questions and answers shown in the FAQ accordion.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm shadow-sm">{error}</div>}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await save();
        }}
        className="space-y-8"
      >
        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] mb-6 relative z-10">FAQ items</h3>
          {form.items.map((item, index) => (
            <div key={index} className="relative z-10 space-y-4 rounded-2xl border border-[#B69CFF]/30 bg-white/80 p-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-2 block">
                  <label className="block text-xs font-medium text-[#25243A]/60 mb-2">Icon</label>
                  <input
                    className="w-full px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                    value={item.icon ?? ''}
                    onChange={(e) => updateItem(index, 'icon', e.target.value)}
                  />
                </div>
                <div className="md:col-span-8 block">
                  <label className="block text-xs font-medium text-[#25243A]/60 mb-2">Question</label>
                  <input
                    className="w-full px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                    value={item.question ?? ''}
                    onChange={(e) => updateItem(index, 'question', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex items-end justify-end">
                  <RowActions
                    index={index}
                    length={form.items.length}
                    onMove={moveItem}
                    onRemove={() => update('items', form.items.filter((_, i) => i !== index))}
                  />
                </div>
              </div>
              <div className="relative z-10 block">
                <label className="block text-xs font-medium text-[#25243A]/60 mb-2">Answer</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                  value={item.answer ?? ''}
                  onChange={(e) => updateItem(index, 'answer', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update('items', [...form.items, { icon: '✦', question: '', answer: '' }])}
            className="relative z-10 mt-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] hover:bg-[#F3EDFF] transition-all"
          >
            <span className="text-[12px]">+</span> Add FAQ item
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white rounded-2xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-[0_0_34px_rgba(139,92,246,.55)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
