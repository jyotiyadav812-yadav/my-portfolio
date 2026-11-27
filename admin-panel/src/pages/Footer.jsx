import { Plus, Save, Trash2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

const KEY = 'footer';

const DEFAULTS = {
  tagline: '',
  copyright: '',
  credit: '',
  cta_title: '',
  cta_text: '',
  logo_url: '',
  links: [],
  expertise: [],
};

function normalize(value) {
  return {
    ...DEFAULTS,
    ...value,
    links: Array.isArray(value.links) ? value.links : [],
    expertise: Array.isArray(value.expertise) ? value.expertise : [],
  };
}

export default function Footer() {
  const { form, setForm, loading, saving, error, toast, setToast, save } = useSiteContent(KEY, DEFAULTS, normalize);

  const update = (field, value) => setForm({ ...form, [field]: value });
  const updateLink = (index, field, value) => {
    const links = [...form.links];
    links[index] = { ...links[index], [field]: value };
    update('links', links);
  };
  const updateExpertise = (index, value) => {
    const expertise = [...form.expertise];
    expertise[index] = value;
    update('expertise', expertise);
  };

  if (loading) return <p className="text-sm text-muted">Loading content...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Footer</h2>
        <p className="text-sm text-muted mt-1">Call to action, quick links, expertise, logo, and copyright.</p>
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
          <h3 className="text-sm font-semibold text-text">Call to action</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">CTA title</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.cta_title ?? ''}
                onChange={(e) => update('cta_title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">CTA text</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.cta_text ?? ''}
                onChange={(e) => update('cta_text', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Tagline</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.tagline ?? ''}
                onChange={(e) => update('tagline', e.target.value)}
              />
            </div>
            <ImageUpload label="Footer logo" value={form.logo_url} onChange={(v) => update('logo_url', v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Copyright text</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.copyright ?? ''}
                onChange={(e) => update('copyright', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Credit line</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.credit ?? ''}
                onChange={(e) => update('credit', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Quick links</h3>
            <button
              type="button"
              onClick={() => update('links', [...form.links, { label: '', url: '' }])}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-lavender hover:bg-[#F3EDFF]"
            >
              <Plus size={16} /> Add link
            </button>
          </div>
          {form.links.map((link, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <input
                placeholder="Label"
                className="md:col-span-5 px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
                value={link.label ?? ''}
                onChange={(e) => updateLink(index, 'label', e.target.value)}
              />
              <input
                placeholder="#about or https://..."
                className="md:col-span-6 px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
                value={link.url ?? ''}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
              />
              <button
                type="button"
                onClick={() => update('links', form.links.filter((_, i) => i !== index))}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                aria-label="Remove link"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Expertise list</h3>
            <button
              type="button"
              onClick={() => update('expertise', [...form.expertise, ''])}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-lavender hover:bg-[#F3EDFF]"
            >
              <Plus size={16} /> Add item
            </button>
          </div>
          {form.expertise.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                className="flex-1 px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
                value={item}
                onChange={(e) => updateExpertise(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => update('expertise', form.expertise.filter((_, i) => i !== index))}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

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
