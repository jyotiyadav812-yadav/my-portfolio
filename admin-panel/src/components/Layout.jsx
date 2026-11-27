import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
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
    <div className="min-h-screen bg-surface">
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-border z-40 flex flex-col transition-transform duration-200 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
          <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-lavender to-cyan grid place-items-center text-white font-bold text-sm">
              JY
            </span>
            <span className="font-bold text-text">Portfolio Admin</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded text-muted hover:bg-surface lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[.15em] text-muted">
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
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#F3EDFF] text-lavender'
                          : 'text-muted hover:bg-surface hover:text-text'
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 mb-3 text-sm font-medium text-lavender border border-border rounded-lg hover:bg-[#F3EDFF] transition"
          >
            View portfolio <ExternalLink size={15} />
          </a>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-lavender to-cyan grid place-items-center text-white text-xs font-bold shrink-0">
              {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text truncate">{user?.email}</p>
              <p className="text-[11px] text-muted">Administrator</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 h-16 flex items-center gap-4 px-4 sm:px-6 bg-white/90 backdrop-blur border-b border-border">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg text-muted hover:bg-surface lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-text truncate">{pageTitle}</h1>
            <p className="text-[11px] text-muted hidden sm:block">Manage your portfolio content</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
