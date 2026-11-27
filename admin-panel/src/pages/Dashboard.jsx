import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Inbox, List, Sparkles, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const QUICK_LINKS = [
  { to: '/admin/profile', label: 'Profile', description: 'Name, about, photos', Icon: User },
  { to: '/admin/site', label: 'Site & Hero', description: 'Headline, buttons, badges', Icon: Sparkles },
  { to: '/admin/skills', label: 'Skills', description: 'Skills and marquee', Icon: List },
  { to: '/admin/messages', label: 'Messages', description: 'Contact submissions', Icon: Inbox },
  { to: '/admin/projects', label: 'Projects', description: 'Featured work', Icon: Briefcase },
  { to: '/admin/tools', label: 'Tools', description: 'AI tools showcase', Icon: Sparkles },
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={stats.projects} />
        <StatCard label="Skills" value="—" hint="Managed in content" />
        <StatCard label="Tools" value="—" hint="Managed in content" />
        <StatCard label="Messages" value={stats.messages} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text mb-4">Quick edit</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map(({ to, label, description, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group min-w-0 rounded-xl border border-border bg-white p-5 shadow-sm transition hover:border-lavender hover:shadow-md"
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

function StatCard({ label, value, hint }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-white p-5 shadow-sm">
      <p className={`font-bold text-lavender ${typeof value === 'number' ? 'text-3xl' : 'text-xl'}`}>{value}</p>
      <p className="mt-1 truncate text-sm text-muted">{label}</p>
      {hint && <p className="mt-1 truncate text-[11px] text-muted">{hint}</p>}
    </div>
  );
}
