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
      <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -right-8 -top-20 w-32 h-32 rounded-full blur-3xl bg-[#8B5CF6]/20" />
        <p className="relative z-10 text-xs font-bold uppercase tracking-[.2em] text-[#8B5CF6]/70">Dashboard</p>
        <h2 className="relative z-10 mt-2 text-3xl sm:text-4xl font-bold text-[#25243A] leading-tight">
          Welcome back${user?.email ? `, ${user.email.split('@')[0]}` : ''}.
        </h2>
        <p className="relative z-10 mt-3 text-sm text-[#25243A]/70 max-w-2xl leading-relaxed">
          Edit any section of your portfolio from the sidebar. Changes are saved to Supabase and appear on the public site after a reload.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={stats.projects} color="#8B5CF6" />
        <StatCard label="Skills" value="—" hint="Managed in content" color="#67DDF5" />
        <StatCard label="Tools" value="—" hint="Managed in content" color="#B69CFF" />
        <StatCard label="Messages" value={stats.messages} color="#FFB6D9" />
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#25243A] mb-5 uppercase tracking-wider text-[#8B5CF6]/60">Quick edit</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUICK_LINKS.map(({ to, label, description, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group relative glass rounded-3xl p-6 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,.35)] transition-all duration-300 border border-[#B69CFF]/30"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5] grid place-items-center text-white mb-4 flex-shrink-0 shadow-lg shadow-purple-300/40">
                <Icon size={20} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-[#25243A]">{label}</p>
                <ArrowRight size={16} className="text-[#8B5CF6] group-hover:text-[#67DDF5] transition" />
              </div>
              <p className="mt-2 text-xs text-[#25243A]/60 leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, color }) {
  return (
    <div className="glass rounded-3xl p-6 border border-[#B69CFF]/30 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-10 h-10 rounded-full bg-white/60 backdrop-blur" />
      <p className={['font-bold text-3xl', typeof value === 'number' ? 'text-3xl' : 'text-2xl'].join(' ') + ` text-[#25243A] relative z-10`}>{value}</p>
      <p className="mt-2 truncate text-sm font-semibold text-[#25243A] relative z-10">{label}</p>
      {hint && <p className="mt-1 truncate text-[11px] text-[#25243A]/50 relative z-10 uppercase tracking-wider">{hint}</p>}
    </div>
  );
}
