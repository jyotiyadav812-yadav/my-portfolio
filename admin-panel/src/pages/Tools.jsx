import { Save } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';
import { RowActions } from '../components/EditorParts';
import { useSiteContent } from '../hooks/useSiteContent';
import { useDeleteGuard } from '../contexts/DeleteGuardContext';

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

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading content...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">AI Tools</h2>
        <p className="text-sm text-[#25243A]/60">Tool names, descriptions, colors, logo images, and showcase text.</p>
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
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#B69CFF]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#B69CFF] mb-6 relative z-10">AI showcase copy</h3>
          <div className="relative z-10 space-y-5">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Showcase title</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.showcase_title ?? ''}
                onChange={(e) => update('showcase_title', e.target.value)}
              />
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Showcase description</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.showcase_text ?? ''}
                onChange={(e) => update('showcase_text', e.target.value)}
              />
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Quote</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.quote ?? ''}
                onChange={(e) => update('quote', e.target.value)}
              />
            </div>
          </div>
        </div>

        <StringListEditor
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

        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] mb-6 relative z-10">Tools</h3>
          {form.items.map((item, index) => (
            <div key={index} className="relative z-10 space-y-4 rounded-2xl border border-[#B69CFF]/30 bg-white/80 p-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 block">
                  <label className="block text-xs font-medium text-[#25243A]/60 mb-2">Tool name</label>
                  <input
                    className="w-full px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                    value={item.name ?? ''}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                  />
                </div>
                <div className="md:col-span-5 block">
                  <label className="block text-xs font-medium text-[#25243A]/60 mb-2">Description</label>
                  <input
                    className="w-full px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                    value={item.description ?? ''}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                </div>
                <div className="md:col-span-3 block">
                  <label className="block text-xs font-medium text-[#25243A]/60 mb-2">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                      value={item.color || '#8B5CF6'}
                      onChange={(e) => updateItem(index, 'color', e.target.value)}
                      aria-label="Tool color"
                    />
                    <input
                      className="flex-1 min-w-0 px-3 py-2 border border-[#B69CFF]/40 rounded-xl bg-white text-sm text-[#25243A] outline-none focus:border-[#8B5CF6]"
                      value={item.color || ''}
                      onChange={(e) => updateItem(index, 'color', e.target.value)}
                    />
                  </div>
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
          <button
            type="button"
            onClick={() => update('items', [...form.items, { name: '', description: '', color: '#8B5CF6', logo_url: '' }])}
            className="relative z-10 mt-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] hover:bg-[#F3EDFF] transition-all"
          >
            <span className="text-[12px]">+</span> Add tool
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

function StringListEditor({ title, items, onAdd, onChange, onRemove }) {
  const confirmDelete = useDeleteGuard();

  const handleRemove = async (index) => {
    const confirmed = await confirmDelete({
      title: `Remove ${title.toLowerCase()} item`,
      description: 'Enter your admin password to remove this item.',
      confirmLabel: 'Remove',
    });
    if (confirmed) onRemove(index);
  };

  return (
    <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#67DDF5]/15" />
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#67DDF5] mb-6 relative z-10">{title}</h3>
      <div className="relative z-10 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 rounded-xl border border-[#B69CFF]/40 bg-white/80 p-4">
            <input
              className="flex-1 px-4 py-3 border-none bg-transparent outline-none text-[#25243A] placeholder-[#25243A]/40"
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
              aria-label="Remove"
            >
              <span className="text-[12px]">×</span>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] hover:bg-[#F3EDFF] transition-all"
        >
          <span className="text-[12px]">+</span> Add item
        </button>
      </div>
    </div>
  );
}
