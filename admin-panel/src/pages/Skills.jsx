import { Save } from 'lucide-react';
import Toast from '../components/Toast';
import { RowActions, SectionCard, StringListCard } from '../components/EditorParts';
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

  if (loading) return <p className="text-sm text-muted">Loading content...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Skills</h2>
        <p className="text-sm text-muted mt-1">Skill cards, icons, soft skills, and the marquee words.</p>
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
          title="Skill cards"
          onAdd={() => update('items', [...form.items, { name: '', description: '', icon: '' }])}
        >
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-4 rounded-xl border border-border bg-surface">
              <input
                placeholder="Skill name"
                className="md:col-span-4 px-3 py-2.5 border border-border rounded-lg bg-white"
                value={item.name ?? ''}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
              />
              <input
                placeholder="Short description"
                className="md:col-span-4 px-3 py-2.5 border border-border rounded-lg bg-white"
                value={item.description ?? ''}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
              />
              <input
                placeholder="Icon / short label"
                className="md:col-span-2 px-3 py-2.5 border border-border rounded-lg bg-white"
                value={item.icon ?? ''}
                onChange={(e) => updateItem(index, 'icon', e.target.value)}
              />
              <RowActions
                index={index}
                length={form.items.length}
                onMove={moveItem}
                onRemove={() => update('items', form.items.filter((_, i) => i !== index))}
              />
            </div>
          ))}
        </SectionCard>

        <StringListCard
          title="Soft skills"
          items={form.soft_skills}
          onAdd={() => update('soft_skills', [...form.soft_skills, ''])}
          onChange={(index, value) => updateSimple('soft_skills', index, value)}
          onRemove={(index) => update('soft_skills', form.soft_skills.filter((_, i) => i !== index))}
        />

        <StringListCard
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
            className="px-5 py-2.5 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover flex items-center gap-2"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
