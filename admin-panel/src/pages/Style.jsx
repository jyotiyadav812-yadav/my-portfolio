import { useEffect } from 'react';
import { Save } from 'lucide-react';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

const KEY = 'style';

const FONTS = [
  'Plus Jakarta Sans',
  'Space Grotesk',
  'Inter',
  'Poppins',
  'Montserrat',
  'Roboto',
  'Playfair Display',
  'Lora',
];

const DEFAULTS = {
  font: 'Plus Jakarta Sans',
  primary: '#8B5CF6',
  accent: '#67DDF5',
};

export default function Style() {
  const { form, setForm, loading, saving, error, toast, setToast, save } = useSiteContent(KEY, DEFAULTS);
  const previewFont = form.font || DEFAULTS.font;

  useEffect(() => {
    const family = (previewFont || DEFAULTS.font).replace(/\s/g, '+');
    let link = document.getElementById('admin-google-font');
    if (!link) {
      link = document.createElement('link');
      link.id = 'admin-google-font';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`;
    document.documentElement.style.setProperty('--admin-font', `"${previewFont}", ui-sans-serif, system-ui, sans-serif`);
  }, [previewFont]);

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading settings...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Style &amp; Fonts</h2>
        <p className="text-sm text-[#25243A]/60">These settings are applied to your public portfolio.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm shadow-sm">{error}</div>}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await save(form);
        }}
        className="space-y-8"
      >
        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] mb-6 relative z-10">Theme settings</h3>
          <div className="relative z-10 space-y-5">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Site font</label>
              <select
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.font || DEFAULTS.font}
                onChange={(e) => setForm({ ...form, font: e.target.value })}
              >
                {FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorField
                label="Primary color"
                value={form.primary || DEFAULTS.primary}
                onChange={(value) => setForm({ ...form, primary: value })}
              />
              <ColorField
                label="Accent color"
                value={form.accent || DEFAULTS.accent}
                onChange={(value) => setForm({ ...form, accent: value })}
              />
            </div>

            <div className="rounded-2xl border border-[#B69CFF]/40 bg-white/80 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]/60 mb-3">Preview</p>
              <p className="text-lg font-medium text-[#25243A]" style={{ fontFamily: `var(--admin-font)` }}>
                The quick brown fox jumps over the lazy dog
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <span
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-lg shadow-purple-300/50"
                  style={{ backgroundColor: form.primary || DEFAULTS.primary }}
                >
                  Primary button
                </span>
                <span
                  className="px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: form.accent || DEFAULTS.accent, color: '#0F172A' }}
                >
                  Accent badge
                </span>
              </div>
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

function ColorField({ label, value, onChange }) {
  return (
    <div className="block">
      <label className="block text-sm font-medium text-[#25243A]/60 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-[#B69CFF]/40 rounded-xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6]"
        />
      </div>
    </div>
  );
}
