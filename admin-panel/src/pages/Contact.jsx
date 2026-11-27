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

  if (loading) return <p className="text-sm text-muted">Loading content...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Contact</h2>
        <p className="text-sm text-muted mt-1">Email, phone, social links, and contact section text.</p>
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
          <h3 className="text-sm font-semibold text-text">Contact details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FIELDS.map(({ key, label, type, Icon }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-muted mb-1.5 flex items-center gap-2">
                  <Icon size={16} /> {label}
                </label>
                <input
                  type={type}
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
                  value={form[key] ?? ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-text">Section copy</h3>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Contact section intro</label>
            <input
              className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
              value={form.intro ?? ''}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Contact form note</label>
            <input
              className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
              value={form.form_note ?? ''}
              onChange={(e) => setForm({ ...form, form_note: e.target.value })}
            />
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
