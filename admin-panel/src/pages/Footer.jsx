import { Plus, Save, Trash2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';
import { useDeleteGuard } from '../contexts/DeleteGuardContext';

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
  const confirmDelete = useDeleteGuard();
  const { form, setForm, loading, saving, error, toast, setToast, save } = useSiteContent(KEY, DEFAULTS, normalize);

  const update = (field, value) => setForm({ ...form, [field]: value });
  const removeLink = async (index) => {
    const confirmed = await confirmDelete({
      title: 'Remove footer link',
      description: 'Enter your admin password to remove this link.',
      confirmLabel: 'Remove',
    });
    if (confirmed) update('links', form.links.filter((_, i) => i !== index));
  };
  const removeExpertise = async (index) => {
    const confirmed = await confirmDelete({
      title: 'Remove expertise item',
      description: 'Enter your admin password to remove this item.',
      confirmLabel: 'Remove',
    });
    if (confirmed) update('expertise', form.expertise.filter((_, i) => i !== index));
  };
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

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading content...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Footer</h2>
        <p className="text-sm text-[#25243A]/60">Call to action, quick links, expertise, logo, and copyright.</p>
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
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] mb-6 relative z-10">Call to action</h3>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">CTA title</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.cta_title ?? ''}
                onChange={(e) => update('cta_title', e.target.value)}
              />
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">CTA text</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.cta_text ?? ''}
                onChange={(e) => update('cta_text', e.target.value)}
              />
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Tagline</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.tagline ?? ''}
                onChange={(e) => update('tagline', e.target.value)}
              />
            </div>
            <div className="block">
              <ImageUpload label="Footer logo" value={form.logo_url} onChange={(v) => update('logo_url', v)} />
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Copyright text</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.copyright ?? ''}
                onChange={(e) => update('copyright', e.target.value)}
              />
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Credit line</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.credit ?? ''}
                onChange={(e) => update('credit', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#67DDF5]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#67DDF5] mb-6 relative z-10">Quick links</h3>
          <div className="relative z-10 flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() => update('links', [...form.links, { label: '', url: '' }])}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] hover:bg-[#F3EDFF] transition-all"
            >
              <span className="text-[12px]">+</span> Add link
            </button>
          </div>
          <div className="relative z-10 space-y-3">
            {form.links.map((link, index) => (
              <div key={index} className="rounded-xl border border-[#B69CFF]/40 bg-white/80 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <input
                    placeholder="Label"
                    className="md:col-span-5 px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                    value={link.label ?? ''}
                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                  />
                  <input
                    placeholder="#about or https://..."
                    className="md:col-span-6 px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white text-[#25243A] outline-none focus:border-[#8B5CF6]"
                    value={link.url ?? ''}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="md:col-span-1 p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    aria-label="Remove link"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#B69CFF]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#B69CFF] mb-6 relative z-10">Expertise list</h3>
          <div className="relative z-10 flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() => update('expertise', [...form.expertise, ''])}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] hover:bg-[#F3EDFF] transition-all"
            >
              <span className="text-[12px]">+</span> Add item
            </button>
          </div>
          <div className="relative z-10 space-y-3">
            {form.expertise.map((item, index) => (
              <div key={index} className="rounded-xl border border-[#B69CFF]/40 bg-white/80 p-4 flex items-center gap-3">
                <input
                  className="flex-1 px-3 py-2.5 border-none bg-transparent outline-none text-[#25243A]"
                  value={item}
                  onChange={(e) => updateExpertise(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeExpertise(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
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
