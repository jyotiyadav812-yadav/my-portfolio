import { Save, Plus, Trash2, Sparkles } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';
import { useDeleteGuard } from '../contexts/DeleteGuardContext';

const KEY = 'profile';

const DEFAULTS = {
  name: '',
  headline: '',
  titles: [''],
  about: '',
  photo_url: '',
  photo_wide_url: '',
  caption: '',
  showcase_caption: '',
};

function normalize(value) {
  return {
    ...DEFAULTS,
    ...value,
    titles: Array.isArray(value.titles) && value.titles.length ? value.titles : [''],
  };
}

export default function Profile() {
  const confirmDelete = useDeleteGuard();
  const { form, setForm, loading, saving, error, toast, setToast, save } = useSiteContent(KEY, DEFAULTS, normalize);

  const update = (field, value) => setForm({ ...form, [field]: value });
  const updateTitle = (index, value) => {
    const titles = [...form.titles];
    titles[index] = value;
    update('titles', titles);
  };
  const removeTitle = async (index) => {
    const confirmed = await confirmDelete({
      title: 'Remove typing title',
      description: 'Enter your admin password to remove this title.',
      confirmLabel: 'Remove',
    });
    if (confirmed) update('titles', form.titles.filter((_, i) => i !== index));
  };

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading content...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Profile</h2>
        <p className="text-sm text-[#25243A]/60">Name, typing titles, about text, and your photos.</p>
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
        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] mb-6 relative z-10">Profile details</h3>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Full name</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Headline</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.headline}
                onChange={(e) => update('headline', e.target.value)}
              />
            </div>
          </div>

          <div className="relative z-10 block">
            <label className="block text-sm font-medium text-[#25243A]/60 mb-2">About text</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
              value={form.about}
              onChange={(e) => update('about', e.target.value)}
            />
            <p className="text-[11px] text-[#25243A]/50 mt-2 uppercase tracking-wider">Wrap words in *asterisks* to highlight them on the site.</p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Round photo</label>
              <ImageUpload label="Round photo" value={form.photo_url} onChange={(v) => update('photo_url', v)} />
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">About / wide photo</label>
              <ImageUpload
                label="About / wide photo"
                value={form.photo_wide_url}
                onChange={(v) => update('photo_wide_url', v)}
              />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">About photo caption</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.caption}
                onChange={(e) => update('caption', e.target.value)}
              />
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Showcase caption</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.showcase_caption}
                onChange={(e) => update('showcase_caption', e.target.value)}
              />
            </div>
          </div>

          <div className="relative z-10 block">
            <label className="flex items-center gap-2 text-sm font-medium text-[#25243A]/60 mb-3">
              <Sparkles size={16} /> Typing titles
            </label>
            <div className="space-y-3">
              {form.titles.map((title, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    className="flex-1 px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                    value={title}
                    onChange={(e) => updateTitle(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeTitle(index)}
                    disabled={form.titles.length <= 1}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-40 transition"
                    aria-label="Remove title"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update('titles', [...form.titles, ''])}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-[#B69CFF]/40 text-sm font-medium text-[#8B5CF6] hover:bg-[#F3EDFF] transition-all"
              >
                <Plus size={16} /> Add title
              </button>
            </div>
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
