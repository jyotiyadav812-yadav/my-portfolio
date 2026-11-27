import { Save, Plus, Trash2, Sparkles } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

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
  const { form, setForm, loading, saving, error, toast, setToast, save } = useSiteContent(KEY, DEFAULTS, normalize);

  const update = (field, value) => setForm({ ...form, [field]: value });
  const updateTitle = (index, value) => {
    const titles = [...form.titles];
    titles[index] = value;
    update('titles', titles);
  };

  if (loading) return <p className="text-sm text-muted">Loading content...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Profile</h2>
        <p className="text-sm text-muted mt-1">Name, typing titles, about text, and your photos.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Full name</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Headline</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.headline}
                onChange={(e) => update('headline', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">About text</label>
            <textarea
              rows={5}
              className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
              value={form.about}
              onChange={(e) => update('about', e.target.value)}
            />
            <p className="text-xs text-muted mt-1">Wrap words in *asterisks* to highlight them on the site.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ImageUpload label="Round photo" value={form.photo_url} onChange={(v) => update('photo_url', v)} />
            <ImageUpload
              label="About / wide photo"
              value={form.photo_wide_url}
              onChange={(v) => update('photo_wide_url', v)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">About photo caption</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.caption}
                onChange={(e) => update('caption', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Showcase caption</label>
              <input
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                value={form.showcase_caption}
                onChange={(e) => update('showcase_caption', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-2">
              <Sparkles size={16} /> Typing titles
            </label>
            <div className="space-y-3">
              {form.titles.map((title, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    className="flex-1 px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                    value={title}
                    onChange={(e) => updateTitle(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => update('titles', form.titles.filter((_, i) => i !== index))}
                    disabled={form.titles.length <= 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-40"
                    aria-label="Remove title"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update('titles', [...form.titles, ''])}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-lavender hover:bg-[#F3EDFF]"
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
            className="px-5 py-2.5 bg-lavender text-white rounded-lg font-medium disabled:opacity-60 hover:bg-lavender-hover flex items-center gap-2"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
