import { Save } from 'lucide-react';
import Toast from '../components/Toast';
import { RowActions } from '../components/EditorParts';
import { useSiteContent } from '../hooks/useSiteContent';

const KEY = 'skills';

const DEFAULTS = {
  items: [],
  soft_skills: [],
  marquee: [],
};

function normalize(value) {
  return {
    ...DEFAULTS,
    ...value,
    items: Array.isArray(value.items) ? value.items : [],
    soft_skills: Array.isArray(value.soft_skills) ? value.soft_skills : [],
    marquee: Array.isArray(value.marquee) ? value.marquee : [],
  };
}

export default function Skills() {
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
  const updateSimple = (field, index, value) => {
    const list = [...form[field]];
    list[index] = value;
    update(field, list);
  };

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading content...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Skills</h2>
        <p className="text-sm text-[#25243A]/60">Skill cards, icons, soft skills, and the marquee words.</p>
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
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] mb-6 relative z-10">Skill cards</h3>
          {form.items.map((item, index) => (
            <div key={index} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 rounded-2xl border border-[#B69CFF]/30 bg-white/80">
              <input
                placeholder="Skill name"
                className="md:col-span-4 px-4 py-3 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                value={item.name ?? ''}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
              />
              <input
                placeholder="Short description"
                className="md:col-span-4 px-4 py-3 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                value={item.description ?? ''}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
              />
              <input
                placeholder="Icon / short label"
                className="md:col-span-3 px-4 py-3 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                value={item.icon ?? ''}
                onChange={(e) => updateItem(index, 'icon', e.target.value)}
              />
              <div className="md:col-span-1">
                <RowActions
                  index={index}
                  length={form.items.length}
                  onMove={moveItem}
                  onRemove={() => update('items', form.items.filter((_, i) => i !== index))}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update('items', [...form.items, { name: '', description: '', icon: '' }])}
            className="relative z-10 mt-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] hover:bg-[#F3EDFF] transition-all"
          >
            <span className="text-[12px]">+</span> Add skill
          </button>
        </div>

        <StringListEditor
          title="Soft skills"
          items={form.soft_skills}
          onAdd={() => update('soft_skills', [...form.soft_skills, ''])}
          onChange={(index, value) => updateSimple('soft_skills', index, value)}
          onRemove={(index) => update('soft_skills', form.soft_skills.filter((_, i) => i !== index))}
        />

        <StringListEditor
          title="Marquee words"
          items={form.marquee}
          onAdd={() => update('marquee', [...form.marquee, ''])}
          onChange={(index, value) => updateSimple('marquee', index, value)}
          onRemove={(index) => update('marquee', form.marquee.filter((_, i) => i !== index))}
        />

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
              onClick={() => onRemove(index)}
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
