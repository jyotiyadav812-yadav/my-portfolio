import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LogOut,
  User,
  Mail,
  LayoutDashboard,
  Palette,
  List,
  GraduationCap,
  MessageCircle,
  Briefcase,
  Sparkles,
  Menu,
  Shield,
  Inbox,
  ExternalLink,
  X,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';

const groups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Portfolio Editor', Icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/site', label: 'Site & Hero', Icon: Sparkles },
      { to: '/admin/nav', label: 'Navigation', Icon: List },
      { to: '/admin/profile', label: 'Profile', Icon: User },
      { to: '/admin/skills', label: 'Skills', Icon: List },
      { to: '/admin/tools', label: 'AI Tools', Icon: Briefcase },
      { to: '/admin/projects', label: 'Projects', Icon: Briefcase },
      { to: '/admin/education', label: 'Education', Icon: GraduationCap },
      { to: '/admin/faq', label: 'FAQ', Icon: MessageCircle },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/admin/contact', label: 'Contact', Icon: Mail },
      { to: '/admin/footer', label: 'Footer', Icon: LayoutDashboard },
      { to: '/admin/style', label: 'Style & Fonts', Icon: Palette },
      { to: '/admin/messages', label: 'Messages', Icon: Inbox },
      { to: '/admin/admins', label: 'Admins', Icon: Shield },
      { to: '/admin/account', label: 'Account', Icon: KeyRound },
    ],
  },
];

const allItems = groups.flatMap((group) => group.items);
const siteUrl = import.meta.env.VITE_SITE_URL || '/portfolio/index.html';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const current = allItems.find((item) => item.to === location.pathname);
  const pageTitle = current?.label ?? 'Portfolio Editor';

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FFF4FA] flex flex-col">
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[#B69CFF]/30 bg-white transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#B69CFF]/30 px-5">
          <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5] text-sm font-bold text-white shadow-lg shadow-purple-300/50">
              JY
            </span>
            <span className="truncate font-bold text-[#25243A]">Portfolio Admin</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl p-1.5 text-[#25243A]/60 hover:bg-[#F8F7FF] lg:hidden transition"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-3 px-5 text-[10px] font-bold uppercase tracking-[.2em] text-[#8B5CF6]/70">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(({ to, label, Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white shadow-lg shadow-[#8B5CF6]/40'
                          : 'text-[#25243A]/70 hover:bg-[#F8F7FF] hover:text-[#8B5CF6] hover:shadow-sm'
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-[#B69CFF]/30 p-5">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#B69CFF]/40 px-4 py-3 text-sm font-medium text-[#8B5CF6] transition-all hover:bg-[#F3EDFF] hover:text-[#67DDF5] mb-4"
          >
            View portfolio <ExternalLink size={14} />
          </a>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5] text-xs font-bold text-white shadow-md">
              {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[#25243A]">{user?.email}</p>
              <p className="text-[10px] text-[#25243A]/50 uppercase tracking-wider">Administrator</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="rounded-xl p-2 text-red-500 hover:bg-red-50 transition"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-lavender text-white shadow-lg shadow-purple-300/50 flex items-center justify-center hover:bg-lavender-hover transition"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40"
          />
          <aside
            className="fixed inset-y-0 right-0 z-40 flex w-[280px] flex-col border-l border-border bg-white shadow-xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <span className="truncate font-bold text-text">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-1.5 text-muted hover:bg-surface"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-5">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[.15em] text-muted">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.items.map(({ to, label, Icon, end }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={end}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm transition ${
                            isActive
                              ? 'bg-[#F3EDFF] font-bold text-lavender'
                              : 'font-medium text-muted hover:bg-surface hover:text-text'
                          }`
                        }
                      >
                        <Icon size={17} className="shrink-0" />
                        <span className="truncate">{label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </>
      )}

      <div className="min-w-0 lg:pl-[260px] flex-1 flex flex-col">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-[#B69CFF]/30 bg-white/80 backdrop-blur px-5 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-xl p-2 text-[#25243A]/60 hover:bg-[#F8F7FF] lg:hidden transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-[#25243A]">{pageTitle}</h1>
            <p className="hidden text-[11px] text-[#25243A]/50 sm:block uppercase tracking-wider">Edit your portfolio content</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center gap-2 rounded-lg border border-[#B69CFF]/40 px-3 py-2 text-sm font-medium text-[#8B5CF6] transition hover:bg-[#F3EDFF] hover:text-[#67DDF5]"
            >
              View portfolio <ExternalLink size={14} />
            </a>
            <span className="hidden text-xs text-[#25243A]/50 sm:block">{user?.email}</span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5] text-xs font-bold text-white shadow-md">
              {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </span>
          </div>
        </header>

        <main className="flex-1 px-5 pb-12 pt-6 sm:px-6">
          <div className="mx-auto w-full max-w-[1200px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
