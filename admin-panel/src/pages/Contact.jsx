import { Link, Mail, Phone, Save } from 'lucide-react';
import Toast from '../components/Toast';
import { useSiteContent } from '../hooks/useSiteContent';

const KEY = 'contact';

const DEFAULTS = {
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  instagram: '',
  intro: '',
  form_note: '',
};

const FIELDS = [
  { key: 'email', label: 'Email', type: 'email', Icon: Mail },
  { key: 'phone', label: 'Phone', type: 'tel', Icon: Phone },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url', Icon: Link },
  { key: 'github', label: 'GitHub URL', type: 'url', Icon: Link },
  { key: 'instagram', label: 'Instagram URL', type: 'url', Icon: Link },
];

export default function Contact() {
  const { form, setForm, loading, saving, error, toast, setToast, save } = useSiteContent(KEY, DEFAULTS);

  if (loading) return <p className="text-sm text-[#25243A]/50">Loading content...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold grad tracking-tight mb-2">Contact</h2>
        <p className="text-sm text-[#25243A]/60">Email, phone, social links, and contact section text.</p>
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
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8B5CF6] mb-6 relative z-10">Contact details</h3>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {FIELDS.map(({ key, label, type, Icon }) => (
              <div key={key} className="block">
                <label className="flex items-center gap-2 text-sm font-medium text-[#25243A]/60 mb-2">
                  <Icon size={16} /> {label}
                </label>
                <input
                  type={type}
                  className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                  value={form[key] ?? ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 sm:p-12 border border-[#B69CFF]/30 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-[#67DDF5]/15" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#67DDF5] mb-6 relative z-10">Section copy</h3>
          <div className="relative z-10 space-y-5">
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Contact section intro</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.intro ?? ''}
                onChange={(e) => setForm({ ...form, intro: e.target.value })}
              />
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-[#25243A]/60 mb-2">Contact form note</label>
              <input
                className="w-full px-4 py-3 border border-[#B69CFF]/40 rounded-2xl bg-white/80 text-[#25243A] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
                value={form.form_note ?? ''}
                onChange={(e) => setForm({ ...form, form_note: e.target.value })}
              />
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
