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

  if (loading) return <p className="text-sm text-muted">Loading settings...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Style & Fonts</h2>
        <p className="text-sm text-muted mt-1">These settings are applied to your public portfolio.</p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await save(form);
        }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Site font</label>
            <select
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lavender"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          <div className="p-5 rounded-xl border border-border bg-surface">
            <p className="text-xs font-medium text-muted mb-2">Preview</p>
            <p className="text-lg" style={{ fontFamily: `var(--admin-font)` }}>
              The quick brown fox jumps over the lazy dog
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span
                className="px-4 py-2 rounded-lg text-white text-xs font-semibold"
                style={{ backgroundColor: form.primary || DEFAULTS.primary }}
              >
                Primary button
              </span>
              <span
                className="px-4 py-2 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: form.accent || DEFAULTS.accent, color: '#0F172A' }}
              >
                Accent badge
              </span>
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

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-11 h-11 rounded-lg cursor-pointer border-0 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-border rounded-lg text-sm"
        />
      </div>
    </div>
  );
}
