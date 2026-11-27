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
} from 'lucide-react';

const groups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true }],
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
  const pageTitle = current?.label ?? 'Dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg">
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border bg-white transition-transform duration-200 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-lavender to-cyan text-sm font-bold text-white">
              JY
            </span>
            <span className="truncate font-bold text-text">Portfolio Admin</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-1.5 text-muted hover:bg-surface lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto py-5">
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

        <div className="shrink-0 border-t border-border p-4">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-lavender transition hover:bg-[#F3EDFF]"
          >
            View portfolio <ExternalLink size={15} />
          </a>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lavender to-cyan text-xs font-bold text-white">
              {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-text">{user?.email}</p>
              <p className="text-[11px] text-muted">Administrator</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-muted hover:bg-surface lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-text sm:text-lg">{pageTitle}</h1>
            <p className="hidden text-[11px] text-muted sm:block">Manage your portfolio content</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:block">{user?.email}</span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lavender to-cyan text-xs font-bold text-white">
              {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </span>
          </div>
        </header>

        <main className="min-w-0 px-4 pb-10 pt-6 sm:px-6">
          <div className="mx-auto w-full max-w-[1200px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
