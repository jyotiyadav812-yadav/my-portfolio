import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Inbox, List, Palette, Sparkles, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/authContext';

const QUICK_LINKS = [
  { to: '/admin/site', label: 'Site & Hero', description: 'Headline, buttons, badges', Icon: Sparkles },
  { to: '/admin/profile', label: 'Profile', description: 'Name, about, photos', Icon: User },
  { to: '/admin/skills', label: 'Skills', description: 'Skills and marquee', Icon: List },
  { to: '/admin/style', label: 'Style & Fonts', description: 'Font and colors', Icon: Palette },
  { to: '/admin/messages', label: 'Messages', description: 'Contact submissions', Icon: Inbox },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ sections: 0, projects: 0, messages: 0 });

  useEffect(() => {
    (async () => {
      const [content, projects, messages] = await Promise.all([
        supabase.from('site_content').select('key'),
        supabase.from('projects').select('id'),
        supabase.from('messages').select('id'),
      ]);
      setStats({
        sections: content.data?.length ?? 0,
        projects: projects.data?.length ?? 0,
        messages: messages.data?.length ?? 0,
      });
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-lavender">Dashboard</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-text mt-2">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}.
        </h2>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Edit any section of your portfolio from the sidebar. Changes are saved to Supabase and appear on the public site after a reload.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Content sections" value={stats.sections} />
        <StatCard label="Projects" value={stats.projects} />
        <StatCard label="Messages" value={stats.messages} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text mb-4">Quick edit</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map(({ to, label, description, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white p-5 rounded-xl border border-border shadow-sm hover:border-lavender hover:shadow-md transition"
            >
              <span className="w-10 h-10 rounded-lg bg-[#F3EDFF] text-lavender grid place-items-center mb-4">
                <Icon size={19} />
              </span>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-text">{label}</p>
                <ArrowRight size={16} className="text-muted group-hover:text-lavender transition" />
              </div>
              <p className="text-xs text-muted mt-1">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-5">
      <p className="text-3xl font-bold text-lavender">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}
