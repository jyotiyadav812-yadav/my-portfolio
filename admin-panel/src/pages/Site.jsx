import { Save, Trash2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
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

  if (site.loading || hero.loading) return <p className="text-sm text-[#25243A]/50">Loading content...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Site &amp; Hero</h2>
        <p className="text-sm text-[#25243A]/60">Browser title, hero headline, buttons, badges, and hero image.</p>
      </div>

      <Toast toast={activeToast} onRemove={() => {
        site.setToast(null);
        hero.setToast(null);
      }} />
      {(site.error || hero.error) && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm shadow-sm">
          {site.error || hero.error}
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await Promise.all([site.save(), hero.save()]);
        }}
        className="space-y-8"
      >
        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] mb-6 relative z-10">Site settings</h3>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Site name" value={site.form.name ?? ''} onChange={(v) => site.setForm({ ...site.form, name: v })} />
            <Field label="Browser title" value={site.form.title ?? ''} onChange={(v) => site.setForm({ ...site.form, title: v })} />
          </div>
          <Field label="Meta description" value={site.form.description ?? ''} onChange={(v) => site.setForm({ ...site.form, description: v })} />
          <ImageUpload label="Site logo" value={site.form.logo_url} onChange={(v) => site.setForm({ ...site.form, logo_url: v })} />
        </div>

        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#67DDF5]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#67DDF5] mb-6 relative z-10">Hero section</h3>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Top badge" value={hero.form.badge ?? ''} onChange={(v) => hero.setForm({ ...hero.form, badge: v })} />
            <Field label="Greeting" value={hero.form.greeting ?? ''} onChange={(v) => hero.setForm({ ...hero.form, greeting: v })} />
            <Field label="Name" value={hero.form.name ?? ''} onChange={(v) => hero.setForm({ ...hero.form, name: v })} />
            <Field label="Subtitle" value={hero.form.subtitle ?? ''} onChange={(v) => hero.setForm({ ...hero.form, subtitle: v })} />
          </div>
          <label className="relative z-10 block">
            <span className="block text-sm font-medium text-[#25243A]/60 mb-2">Hero description</span>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
              value={hero.form.description ?? ''}
              onChange={(e) => hero.setForm({ ...hero.form, description: e.target.value })}
            />
          </label>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Primary button text" value={hero.form.primary_text ?? ''} onChange={(v) => hero.setForm({ ...hero.form, primary_text: v })} />
            <Field label="Primary button link" value={hero.form.primary_link ?? ''} onChange={(v) => hero.setForm({ ...hero.form, primary_link: v })} />
            <Field label="Secondary button text" value={hero.form.secondary_text ?? ''} onChange={(v) => hero.setForm({ ...hero.form, secondary_text: v })} />
            <Field label="Secondary button link" value={hero.form.secondary_link ?? ''} onChange={(v) => hero.setForm({ ...hero.form, secondary_link: v })} />
          </div>
          <ImageUpload label="Hero image" value={hero.form.image_url} onChange={(v) => hero.setForm({ ...hero.form, image_url: v })} />
        </div>

        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#B69CFF]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#B69CFF] mb-6 relative z-10">Hero tags</h3>
          <SectionCard
            title="Hero tags"
            onAdd={() => hero.setForm({ ...hero.form, tags: [...hero.form.tags, { label: '', color: '#8B5CF6' }] })}
          >
            {hero.form.tags.map((tag, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <input
                  placeholder="Tag label"
                  className="md:col-span-9 px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6]"
                  value={tag.label ?? ''}
                  onChange={(e) => updateHeroTag(index, 'label', e.target.value)}
                />
                <input
                  type="color"
                  aria-label="Tag color"
                  className="w-12 h-11 rounded-xl cursor-pointer border border-[#B69CFF]/40 bg-white/80"
                  value={tag.color || '#8B5CF6'}
                  onChange={(e) => updateHeroTag(index, 'color', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => hero.setForm({ ...hero.form, tags: hero.form.tags.filter((_, i) => i !== index) })}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                  aria-label="Remove tag"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </SectionCard>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={site.saving || hero.saving}
            className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white rounded-2xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-[0_0_34px_rgba(139,92,246,.55)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
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
      <span className="block text-sm font-medium text-[#25243A]/60 mb-2">{label}</span>
      <input
        className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SectionCard({ title, children, onAdd }) {
  return (
    <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6]">{title}</h3>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] hover:bg-[#F3EDFF] transition"
          >
            <span className="text-[12px]">+</span> Add
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
