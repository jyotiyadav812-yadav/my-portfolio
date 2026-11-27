import { Save, Trash2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { SectionCard } from '../components/EditorParts';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

const SITE_DEFAULTS = { name: '', title: '', description: '', logo_url: '' };
const HERO_DEFAULTS = {
  badge: '',
  greeting: '',
  name: '',
  subtitle: '',
  description: '',
  primary_text: '',
  primary_link: '',
  secondary_text: '',
  secondary_link: '',
  image_url: '',
  tags: [],
};

function normalizeHero(value) {
  return { ...HERO_DEFAULTS, ...value, tags: Array.isArray(value.tags) ? value.tags : [] };
}

export default function Site() {
  const site = useSiteContent('site', SITE_DEFAULTS);
  const hero = useSiteContent('hero', HERO_DEFAULTS, normalizeHero);
  const activeToast = hero.toast || site.toast;

  const updateHeroTag = (index, field, value) => {
    const tags = [...hero.form.tags];
    tags[index] = { ...tags[index], [field]: value };
    hero.setForm({ ...hero.form, tags });
  };

  if (site.loading || hero.loading) return <p className="text-sm text-muted">Loading content...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Site & Hero</h2>
        <p className="text-sm text-muted mt-1">Browser title, hero headline, buttons, badges, and hero image.</p>
      </div>

      <Toast toast={activeToast} onRemove={() => {
        site.setToast(null);
        hero.setToast(null);
      }} />
      {(site.error || hero.error) && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {site.error || hero.error}
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await Promise.all([site.save(), hero.save()]);
        }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-text">Site settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Site name" value={site.form.name ?? ''} onChange={(v) => site.setForm({ ...site.form, name: v })} />
            <Field label="Browser title" value={site.form.title ?? ''} onChange={(v) => site.setForm({ ...site.form, title: v })} />
          </div>
          <Field label="Meta description" value={site.form.description ?? ''} onChange={(v) => site.setForm({ ...site.form, description: v })} />
          <ImageUpload label="Site logo" value={site.form.logo_url} onChange={(v) => site.setForm({ ...site.form, logo_url: v })} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-text">Hero section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Top badge" value={hero.form.badge ?? ''} onChange={(v) => hero.setForm({ ...hero.form, badge: v })} />
            <Field label="Greeting" value={hero.form.greeting ?? ''} onChange={(v) => hero.setForm({ ...hero.form, greeting: v })} />
            <Field label="Name" value={hero.form.name ?? ''} onChange={(v) => hero.setForm({ ...hero.form, name: v })} />
            <Field label="Subtitle" value={hero.form.subtitle ?? ''} onChange={(v) => hero.setForm({ ...hero.form, subtitle: v })} />
          </div>
          <label className="block">
            <span className="block text-sm font-medium text-muted mb-1.5">Hero description</span>
            <textarea
              rows={3}
              className="w-full px-3 py-2.5 border border-border rounded-lg"
              value={hero.form.description ?? ''}
              onChange={(e) => hero.setForm({ ...hero.form, description: e.target.value })}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Primary button text" value={hero.form.primary_text ?? ''} onChange={(v) => hero.setForm({ ...hero.form, primary_text: v })} />
            <Field label="Primary button link" value={hero.form.primary_link ?? ''} onChange={(v) => hero.setForm({ ...hero.form, primary_link: v })} />
            <Field label="Secondary button text" value={hero.form.secondary_text ?? ''} onChange={(v) => hero.setForm({ ...hero.form, secondary_text: v })} />
            <Field label="Secondary button link" value={hero.form.secondary_link ?? ''} onChange={(v) => hero.setForm({ ...hero.form, secondary_link: v })} />
          </div>
          <ImageUpload label="Hero image" value={hero.form.image_url} onChange={(v) => hero.setForm({ ...hero.form, image_url: v })} />
        </div>

        <SectionCard
          title="Hero tags"
          onAdd={() => hero.setForm({ ...hero.form, tags: [...hero.form.tags, { label: '', color: '#8B5CF6' }] })}
        >
          {hero.form.tags.map((tag, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <input
                placeholder="Tag label"
                className="md:col-span-9 px-3 py-2.5 border border-border rounded-lg"
                value={tag.label ?? ''}
                onChange={(e) => updateHeroTag(index, 'label', e.target.value)}
              />
              <input
                type="color"
                aria-label="Tag color"
                className="w-12 h-11 rounded cursor-pointer border border-border bg-white"
                value={tag.color || '#8B5CF6'}
                onChange={(e) => updateHeroTag(index, 'color', e.target.value)}
              />
              <button
                type="button"
                onClick={() => hero.setForm({ ...hero.form, tags: hero.form.tags.filter((_, i) => i !== index) })}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                aria-label="Remove tag"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </SectionCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={site.saving || hero.saving}
            className="px-5 py-2.5 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover flex items-center gap-2"
          >
            <Save size={18} /> {site.saving || hero.saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-muted mb-1.5">{label}</span>
      <input
        className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
