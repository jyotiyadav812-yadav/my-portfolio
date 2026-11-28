import { useEffect, useState } from 'react';
import { Save, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';

const EMPTY = {
  seo_title: '',
  seo_description: '',
  og_image_url: '',
  keywords: '',
};

export default function Seo() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('site_settings')
      .select('seo_title, seo_description, og_image_url, keywords')
      .eq('id', 1)
      .maybeSingle();
    if (err) setError(err.message);
    else setForm({ ...EMPTY, ...(data || {}) });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      og_image_url: form.og_image_url,
      keywords: form.keywords,
    };
    const { error: err } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...payload }, { onConflict: 'id' });
    setSaving(false);
    if (err) setToast({ kind: 'error', message: err.message });
    else setToast({ kind: 'success', message: 'SEO settings saved. Your portfolio will update on reload.' });
  };

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading SEO settings...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2 flex items-center gap-3">
          <Search size={30} className="text-[#8B5CF6]" /> SEO
        </h2>
        <p className="text-sm text-[#25243A]/60">
          Search engine titles, descriptions, social share image and keywords. These power the public portfolio&apos;s meta and Open Graph tags.
        </p>
      </div>

      <Toast toast={toast} onRemove={() => setToast(null)} />
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm shadow-sm">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm space-y-6 relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#8B5CF6]/15" />

        <div className="relative z-10">
          <Field
            label="SEO title"
            value={form.seo_title ?? ''}
            onChange={(v) => update('seo_title', v)}
            placeholder="Jyoti Yadav | Aspiring Web Developer & AI Tools Enthusiast"
          />
          <p className="mt-1 text-xs text-[#25243A]/50">Aim for 50-60 characters. Appears in the browser tab and search results.</p>
        </div>

        <div className="relative z-10">
          <Field
            label="SEO description"
            textarea
            value={form.seo_description ?? ''}
            onChange={(v) => update('seo_description', v)}
            placeholder="Portfolio of Jyoti Yadav: aspiring web developer, AI tools enthusiast and digital creator."
          />
          <p className="mt-1 text-xs text-[#25243A]/50">Aim for 120-160 characters. Shown under the title in search results.</p>
        </div>

        <div className="relative z-10">
          <ImageUpload label="Open Graph image (og:image)" value={form.og_image_url} onChange={(v) => update('og_image_url', v)} />
          <p className="mt-1 text-xs text-[#25243A]/50">Recommended 1200x630px. Used when the portfolio is shared on social media.</p>
        </div>

        <div className="relative z-10">
          <Field
            label="Keywords"
            value={form.keywords ?? ''}
            onChange={(v) => update('keywords', v)}
            placeholder="Jyoti Yadav, web developer, AI tools, digital marketing"
          />
          <p className="mt-1 text-xs text-[#25243A]/50">Comma-separated. Less important for Google, still used by some engines.</p>
        </div>

        <div className="relative z-10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white rounded-2xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-[0_0_34px_rgba(139,92,246,.55)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save SEO settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[#25243A]/60 mb-2">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
        />
      )}
    </label>
  );
}