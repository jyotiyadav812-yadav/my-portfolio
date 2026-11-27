import { useState, useEffect } from 'react';
import { Save, Pencil, ArrowRight, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const KEYS = ['site', 'nav', 'hero', 'profile', 'skills', 'tools', 'projects', 'education', 'faq', 'contact', 'footer', 'style'];

const DEFAULTS = {
  site: { name: 'Jyoti Yadav', title: 'Jyoti Yadav | Portfolio', description: '', logo_url: '' },
  nav: { items: [{ label: 'Home', url: '#home', visible: true }, { label: 'About', url: '#about', visible: true }, { label: 'Skills', url: '#skills', visible: true }, { label: 'AI Tools', url: '#aitools', visible: true }, { label: 'Projects', url: '#projects', visible: true }, { label: 'Education', url: '#education', visible: true }, { label: 'Contact', url: '#contact', visible: true }, { label: 'FAQ', url: '#faq', visible: true }] },
  hero: { badge: 'Digital Marketing with AI · Pursuing', greeting: 'Hi,', name: 'Jyoti Yadav', subtitle: 'Frontend Developer', description: 'I blend creativity with technology, building clean, responsive websites, exploring the latest AI tools and creating videos and digital content that tell great stories.', primary_text: 'Explore My Work', primary_link: '#projects', secondary_text: "Let's Connect", secondary_link: '#contact', image_url: '', tags: [{ label: 'Frontend Development', color: '#8B5CF6' }, { label: 'AI Tools & Prompt Engineering', color: '#67DDF5' }, { label: 'Video Editing', color: '#FFB6D9' }] },
  profile: { name: 'Jyoti Yadav', headline: 'Aspiring Web Developer & AI Tools Enthusiast', titles: ['Frontend Developer', 'AI Tools Explorer', 'Creative Video Editor', 'Digital Marketing Enthusiast'], about: '', photo_url: '', photo_wide_url: '', caption: '💡 Better ideas, bigger goals', showcase_caption: '✨ Human creativity × AI' },
  skills: { items: [], soft_skills: [], marquee: [] },
  tools: { items: [], showcase_title: 'Where ideas meet intelligence', showcase_text: "AI isn’t a shortcut for me, it’s a creative co-pilot.", quote: 'Tools change every day. Curiosity never goes out of style.', chips: ['Ideate', 'Build', 'Create', 'Repeat'] },
  projects: [],
  education: { intro: '', items: [] },
  faq: { items: [] },
  contact: { email: '', phone: '', linkedin: '', github: '', instagram: '', intro: '', form_note: '' },
  footer: { tagline: '', copyright: '', credit: '', cta_title: '', cta_text: '', logo_url: '', links: [], expertise: [] },
  style: { font: 'Plus Jakarta Sans', primary: '#8B5CF6', accent: '#67DDF5' },
};

export default function CMS() {
  const { user } = useAuth();
  const [forms, setForms] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edits, setEdits] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const next = {};
      for (const key of KEYS) {
        const { data } = await supabase.from('site_content').select('value').eq('key', key).maybeSingle();
        next[key] = data?.value ?? DEFAULTS[key];
      }
      setForms(next);
      setLoading(false);
    };
    load();
  }, []);

  const set = (key, field, value) => {
    setForms(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };
  const setEdit = (key, field, value) => setEdits(prev => ({ ...prev, [`${key}.${field}`]: value }));

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      await Promise.all(KEYS.map(key =>
        supabase.from('site_content').upsert({ key, value: forms[key], updated_at: new Date().toISOString() }, { onConflict: 'key' })
      ));
      setEdits({});
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const isEdited = (key, field) => edits[`${key}.${field}`] !== undefined;
  const getValue = (key, field) => edits[`${key}.${field}`] ?? forms[key]?.[field];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-[#B69CFF]/30 border-t-[#8B5CF6] animate-spin" />
        <p className="text-sm text-[#25243A]/60">Loading portfolio...</p>
      </div>
    </div>
  );

  const navItems = forms.nav?.items || [];
  const hero = forms.hero;
  const profile = forms.profile;
  const skills = forms.skills;
  const tools = forms.tools;
  const projects = forms.projects || [];
  const education = forms.education;
  const faq = forms.faq;
  const contact = forms.contact;
  const footer = forms.footer;
  const style = forms.style;

  return (
    <div className="min-h-screen bg-[#FFF4FA] flex flex-col" style={{ fontFamily: `var(--admin-font, "${style.font}", system-ui, sans-serif)` }}>
      <header className="fixed top-0 inset-x-0 z-50 px-5 py-4 sm:px-6">
        <div className="glass max-w-5xl mx-auto rounded-[26px] sm:rounded-full px-3 sm:px-4 py-2 flex items-center justify-between gap-3 transition-all duration-300">
          <a href="#home" className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-full grid place-items-center text-white text-xs font-bold bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5] shadow-md shadow-purple-300/50">
              {style.font?.slice(0,1) || 'J'}
            </span>
            <span className="font-bold grad whitespace-nowrap text-sm sm:text-lg">{getValue('site', 'name') || 'Jyoti Yadav'}</span>
          </a>
          <nav className="hidden md:flex items-center gap-0.5 xl:gap-1">
            {navItems.filter(i => i.visible !== false).map((item, i) => (
              <a key={i} href={item.url} className="nav-link px-2.5 xl:px-3 py-2 text-xs xl:text-sm text-[#25243A]/75 hover:text-[#8B5CF6] rounded-full hover:bg-[#F4F1FF] whitespace-nowrap transition">
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="hidden lg:inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] shadow-md shadow-purple-300/50 hover:shadow-lg hover:-translate-y-0.5 transition whitespace-nowrap">Let's Connect</a>
        </div>
      </header>

      <main className="relative z-10 pt-24 px-5 pb-20 max-w-6xl mx-auto">
        {/* HERO */}
        <section id="home" className="relative min-h-screen flex items-center px-5 pt-32 sm:pt-36 pb-24 overflow-hidden" style={{ background: `linear-gradient(160deg,#FBFAFF 0%,#F4F1FF 55%,#FFF4FA 100%)` }}>
          <div className="absolute -top-24 -right-24 w-[26rem] h-[26rem] rounded-full blur-3xl" style={{ background: "rgba(182,156,255,.35)" }} aria-hidden="true" />
          <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(103,221,245,.25)" }} aria-hidden="true" />
          <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(255,214,234,.5)" }} aria-hidden="true" />
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.08) 1px,transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse at center,#000 30%,transparent 75%)" }} aria-hidden="true" />
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center relative z-10">
            <div className="text-center lg:text-left">
              <EditBtn section="hero" field="badge" value={getValue('hero','badge')} label="Edit badge" />
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#8B5CF6] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#67DDF5]" style={{ boxShadow: "0 0 10px #67DDF5" }} />
                {isEdited('hero','badge') ? <input className="bg-transparent border-none outline-none px-2 text-[#8B5CF6] font-semibold text-sm" value={edits['hero.badge']} onChange={e => setEdit('hero','badge',e.target.value)} /> : getValue('hero','badge') || 'Digital Marketing with AI · Pursuing'}
              </div>
              <h1 className="font-bold leading-[1.05]">
                <span className="block text-3xl sm:text-4xl text-[#25243A]/80 mb-1">{getValue('hero','greeting') || 'Hi,'} I'm</span>
                <span className="block text-5xl sm:text-6xl xl:text-7xl pb-2 grad" contentEditable={isEdited('hero','name')} onInput={e => setEdit('hero','name',e.target.currentTarget ? e.target.currentTarget.textContent : e.target.textContent)} dangerouslySetInnerHTML={{ __html: getValue('hero','name') || 'Jyoti Yadav' }}>
                  {isEdited('hero','name') ? <span contentEditable={true} onInput={e => setEdit('hero','name',e.target.textContent)}>{getValue('hero','name')}</span> : (getValue('hero','name') || 'Jyoti Yadav')}
                </span>
              </h1>
              <div className="mt-4 text-xl sm:text-2xl font-semibold h-9" contentEditable={isEdited('hero','subtitle')} onInput={e => setEdit('hero','subtitle',e.target.textContent)}>
                {isEdited('hero','subtitle') ? <span contentEditable={true}>{getValue('hero','subtitle')}</span> : (getValue('hero','subtitle') || 'Frontend Developer')}
              </div>
              <p className="mt-3 text-base sm:text-lg text-[#25243A]/70 max-w-lg mx-auto lg:mx-0 leading-relaxed" contentEditable={isEdited('hero','description')} onInput={e => setEdit('hero','description',e.target.textContent)}>
                {isEdited('hero','description') ? <span contentEditable={true}>{getValue('hero','description')}</span> : (getValue('hero','description') || 'I blend creativity with technology...')}
              </p>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                <a href={getValue('hero','primary_link') || '#projects'} className="inline-block px-7 py-3.5 rounded-full font-semibold text-sm text-white shadow-lg shadow-purple-300/50 bg-gradient-to-r from-[#8B5CF6] to-[#B69CFF] hover:shadow-[0_0_34px_rgba(139,92,246,.55)] transition">
                  {isEdited('hero','primary_text') ? <input className="bg-transparent border-none outline-none px-2 text-white font-semibold text-sm" value={edits['hero.primary_text']} onChange={e => setEdit('hero','primary_text',e.target.value)} /> : (getValue('hero','primary_text') || 'Explore My Work')}
                </a>
                <a href={getValue('hero','secondary_link') || '#contact'} className="inline-block px-7 py-3.5 rounded-full font-semibold text-sm glass text-[#25243A] hover:shadow-[0_0_34px_rgba(139,92,246,.55)] transition">
                  {isEdited('hero','secondary_text') ? <input className="bg-transparent border-none outline-none px-2 text-[#25243A] font-semibold text-sm" value={edits['hero.secondary_text']} onChange={e => setEdit('hero','secondary_text',e.target.value)} /> : (getValue('hero','secondary_text') || "Let's Connect")}
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
                {Object.entries(contact?.links || {}).map(([k,v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener" className="glass w-11 h-11 rounded-full grid place-items-center text-[#25243A]/80 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:!bg-gradient-to-br hover:from-[#8B5CF6] hover:to-[#67DDF5] hover:shadow-[0_8px_24px_rgba(139,92,246,.45)]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">{k==='LinkedIn'?<path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2 3.77-2 4.03 0 4.77 2.6 4.77 6V21h-4v-4.9c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-4z"/>:k==='GitHub'?<path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 016 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0023.5 12C23.5 5.7 18.3.5 12 .5z"/>:<path fill="currentColor" d="M3 3h18v18H3z" />}</svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="relative mx-auto w-[300px] sm:w-[420px] lg:w-[490px]">
              <div className="absolute inset-[14%] rounded-full blur-3xl opacity-60" style={{ background: "radial-gradient(circle,#B69CFF,#67DDF5 60%,transparent 72%)" }} />
              <ImageBtn section="hero" field="image_url" value={getValue('hero','image_url')} label="Change hero photo" />
              <div className="absolute inset-[15%] rounded-full p-[5px] overflow-hidden shadow-2xl shadow-purple-300/60">
                <div className="absolute inset-[-50%]" style={{ background: "conic-gradient(#B69CFF,#67DDF5,#FFD6EA,#8B5CF6,#B69CFF)", animation: "spin 8s linear infinite" }} />
                <div className="relative w-full h-full rounded-full bg-[#F8F7FF] overflow-hidden grid place-items-center">
                  {getValue('hero','image_url') ? (
                    <img src={getValue('hero','image_url')} alt="Hero" className="w-full h-full object-cover" style={{ objectPosition: "50% 10%" }} />
                  ) : (
                    <span className="text-5xl sm:text-6xl font-bold grad">{getValue('hero','name')?.slice(0,2) || 'JY'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-20 md:py-28 px-5 bg-[#F8F7FF]/40 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[.3em] uppercase text-[#8B5CF6] font-semibold mb-3">About</p>
              <h2 className="text-3xl md:text-5xl font-bold grad pb-1">A little about me</h2>
            </div>
            <div className="grid lg:grid-cols-[320px_1fr] gap-12 lg:gap-16 items-center">
              <div className="relative mx-auto w-full max-w-[300px] lg:max-w-none">
                <div className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-60" style={{ background: "linear-gradient(135deg,#B69CFF,#67DDF5,#FFD6EA)" }} />
                <div className="fl relative">
                  <div className="rounded-[2rem] p-1.5 bg-gradient-to-br from-[#B69CFF] via-[#67DDF5] to-[#FFD6EA] shadow-2xl shadow-purple-300/50">
                    <div className="overflow-hidden rounded-[1.7rem]">
                      <ImageBtn section="profile" field="photo_url" value={getValue('profile','photo_url')} label="Change about photo" />
                    </div>
                  </div>
                  <div className="glass fl absolute -bottom-4 -left-3 sm:-left-6 rounded-2xl px-4 py-2.5 text-sm font-semibold" contentEditable={isEdited('profile','caption')} onInput={e => setEdit('profile','caption',e.target.textContent)}>
                    {isEdited('profile','caption') ? <span contentEditable={true}>{getValue('profile','caption')}</span> : (getValue('profile','caption') || '💡 Better ideas, bigger goals')}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">I turn ideas into <span className="grad">digital experiences.</span></h3>
                <p className="text-lg sm:text-xl leading-[1.9] text-[#25243A]" contentEditable={isEdited('profile','about')} onInput={e => setEdit('profile','about',e.target.textContent)}>
                  {isEdited('profile','about') ? <span contentEditable={true}>{getValue('profile','about')}</span> : (getValue('profile','about') || "I'm Jyoti Yadav, a curious learner exploring the space where web development, AI tools and digital creativity meet.")}
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[{l:'Projects',v:projects.length},{l:'Skills',v:skills.items.length},{l:'AI Tools',v:tools.items.length}].map(x => (
                    <div key={x.l} className="glass gb card rounded-2xl p-4 text-center">
                      <p className="text-3xl font-bold grad">{x.v}</p>
                      <p className="text-xs sm:text-sm text-[#25243A]/65 mt-1">{x.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="py-20 md:py-28 px-5 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#fff,#F8F7FF)' }}>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[.3em] uppercase text-[#8B5CF6] font-semibold mb-3">Skills</p>
              <h2 className="text-3xl md:text-5xl font-bold grad pb-1">What I work with</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {skills.items.map((s, i) => (
                <div key={i} className="glass gb card rounded-2xl p-6 h-full">
                  <div className="w-11 h-11 rounded-xl grid place-items-center text-white font-bold mb-4 bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5]">{s.icon || '✦'}</div>
                  <h3 className="font-semibold text-lg" contentEditable={isEdited(`skills.items.${i}.name`)} onInput={e => setEdit(`skills.items.${i}.name`,e.target.textContent)}>{s.name || 'Skill'}</h3>
                  <p className="text-sm text-[#25243A]/65 mt-1" contentEditable={isEdited(`skills.items.${i}.description`)} onInput={e => setEdit(`skills.items.${i}.description`,e.target.textContent)}>{s.description || ''}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <div className="flex flex-wrap justify-center gap-3">
                {skills.soft_skills.map((s,i) => (
                  <span key={i} className="glass px-5 py-2 rounded-full text-sm font-medium" contentEditable={isEdited(`skills.soft_skills.${i}`)} onInput={e => setEdit(`skills.soft_skills.${i}`,e.target.textContent)}>{s || 'Skill'}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AI TOOLS */}
        <section id="aitools" className="py-20 md:py-28 px-5 bg-[#F8F7FF]/40 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[.3em] uppercase text-[#8B5CF6] font-semibold mb-3">AI Tools</p>
              <h2 className="text-3xl md:text-5xl font-bold grad pb-1">My AI toolkit</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-60" style={{ background: "linear-gradient(135deg,#B69CFF,#67DDF5,#FFD6EA)" }} />
                <div className="relative rounded-[2rem] p-1.5 bg-gradient-to-br from-[#B69CFF] via-[#67DDF5] to-[#FFD6EA] shadow-2xl shadow-purple-300/50">
                  <ImageBtn section="profile" field="photo_wide_url" value={getValue('profile','photo_wide_url')} label="Change showcase photo" />
                </div>
                <div className="glass fl absolute -bottom-5 left-4 sm:-left-6 rounded-2xl px-4 py-2.5 text-sm font-semibold" contentEditable={isEdited('profile','showcase_caption')} onInput={e => setEdit('profile','showcase_caption',e.target.textContent)}>
                  {isEdited('profile','showcase_caption') ? <span contentEditable={true}>{getValue('profile','showcase_caption')}</span> : (getValue('profile','showcase_caption') || '✨ Human creativity × AI')}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-bold leading-tight" contentEditable={isEdited('tools','showcase_title')} onInput={e => setEdit('tools','showcase_title',e.target.textContent)}>{getValue('tools','showcase_title') || 'Where ideas meet intelligence'}</h3>
                <p className="mt-4 text-[#25243A]/70 leading-relaxed" contentEditable={isEdited('tools','showcase_text')} onInput={e => setEdit('tools','showcase_text',e.target.textContent)}>{getValue('tools','showcase_text') || "AI isn’t a shortcut for me..."}</p>
                <p className="mt-4 italic text-[#8B5CF6] font-medium" contentEditable={isEdited('tools','quote')} onInput={e => setEdit('tools','quote',e.target.textContent)}>“{getValue('tools','quote')}”</p>
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
                  {tools.chips.map((c,i) => (
                    <span key={i} className="glass px-4 py-1.5 rounded-full text-sm font-medium" contentEditable={isEdited(`tools.chips.${i}`)} onInput={e => setEdit(`tools.chips.${i}`,e.target.textContent)}>{c || 'Chip'}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tools.items.map((t, i) => (
                <div key={i} className="glass gb card rounded-2xl p-5 h-full">
                  <div className="w-12 h-12 mb-3">{t.logo_url ? <img src={t.logo_url} alt={t.name} className="w-full h-full object-contain bg-white rounded-2xl" /> : <span className="w-full h-full rounded-xl grid place-items-center text-white font-bold bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5]">{t.name?.slice(0,1) || 'A'}</span>}</div>
                  <h3 className="font-semibold" contentEditable={isEdited(`tools.items.${i}.name`)} onInput={e => setEdit(`tools.items.${i}.name`,e.target.textContent)}>{t.name || 'Tool'}</h3>
                  <p className="text-sm text-[#25243A]/65 mt-1" contentEditable={isEdited(`tools.items.${i}.description`)} onInput={e => setEdit(`tools.items.${i}.description`,e.target.textContent)}>{t.description || ''}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-20 md:py-28 px-5 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#fff,#F8F7FF)' }}>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[.3em] uppercase text-[#8B5CF6] font-semibold mb-3">Projects</p>
              <h2 className="text-3xl md:text-5xl font-bold grad pb-1">Things I've built</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((p, i) => {
                const [a,b] = (p.gradient || '#8B5CF6,#67DDF5').split(',');
                return (
                  <div key={i} className="glass gb card rounded-3xl overflow-hidden h-full flex flex-col">
                    <div className="h-44 grid place-items-center text-6xl" style={{ background: `linear-gradient(135deg,${a},${b||'#67DDF5'})` }}>
                      {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <span className="fl drop-shadow-lg">{p.emoji || '✦'}</span>}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg" contentEditable={isEdited(`projects.${i}.title`)} onInput={e => setEdit(`projects.${i}.title`,e.target.textContent)}>{p.title}</h3>
                      <p className="text-sm text-[#25243A]/65 mt-2 flex-1" contentEditable={isEdited(`projects.${i}.description`)} onInput={e => setEdit(`projects.${i}.description`,e.target.textContent)}>{p.description}</p>
                      <a href={p.link || '#'} target="_blank" rel="noopener noreferrer" className="mt-5 text-sm font-semibold text-[#8B5CF6] hover:underline">View Project →</a>
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && <div className="col-span-full text-center py-20 text-[#25243A]/50">No projects yet.</div>}
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="py-20 md:py-28 px-5 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[.3em] uppercase text-[#8B5CF6] font-semibold mb-3">Education</p>
              <h2 className="text-3xl md:text-5xl font-bold grad pb-1">My learning journey</h2>
            </div>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 -translate-x-1/2 bg-[#B69CFF]/20" />
              {education.items.map((x, i) => {
                const left = i % 2 === 0;
                return (
                  <div key={x.title || i} className="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-16 mb-12 last:mb-0">
                    <span className="absolute left-4 md:left-1/2 top-9 -translate-x-1/2 grid place-items-center">
                      <span className="w-10 h-10 rounded-full bg-white ring-2 ring-[#B69CFF] shadow-lg grid place-items-center text-lg">{x.emoji || '✦'}</span>
                    </span>
                    <div className={(left?"md:col-start-1":"md:col-start-2")+" md:row-start-1"}>
                      <div className="glass gb card rounded-3xl p-6 relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl grid place-items-center text-white font-bold bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5] shadow-lg shadow-purple-300/50">{x.icon || '✦'}</div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F8F7FF] border border-[#B69CFF]/40 text-[#8B5CF6]">{x.grow} {x.tag}</span>
                          <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full text-white bg-gradient-to-r from-[#8B5CF6] to-[#B69CFF] shadow-md">{x.score === null ? '⚡ Level 0' : '🔓 Level 0'}{i+1}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold" contentEditable={isEdited(`education.items.${i}.title`)} onInput={e => setEdit(`education.items.${i}.title`,e.target.textContent)}>{x.title}</h3>
                            <p className="text-sm text-[#25243A]/65 mt-0.5">{x.place}{x.year ? ` · ${x.year}` : ''}</p>
                            <p className="text-sm italic text-[#8B5CF6] mt-2">“{x.tagline}”</p>
                          </div>
                          <div className="shrink-0 inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full text-white bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5]">
                            {x.score === null ? <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> : <Ring v={x.score} />}{x.score === null ? 'NOW' : x.score + '%'}
                          </div>
                        </div>
                        {x.chips?.length && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {x.chips.map((c, ci) => (
                              <span key={ci} className="text-xs px-2.5 py-1 rounded-full bg-[#F8F7FF] border border-[#B69CFF]/40 text-[#25243A]/75">✓ {c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 md:py-28 px-5 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#F8F7FF,#EFEAFF)' }}>
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <p className="text-xs tracking-[.3em] uppercase text-[#8B5CF6] font-semibold mb-3">Contact</p>
            <h2 className="text-3xl md:text-5xl font-bold grad pb-1">Let's connect</h2>
            <p className="text-[#25243A]/70 mt-3 text-lg" contentEditable={isEdited('contact','intro')} onInput={e => setEdit('contact','intro',e.target.textContent)}>{getValue('contact','intro') || 'Have an idea or opportunity? I’d love to hear from you.'}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href={`mailto:${getValue('contact','email')}`} className="block mt-5 text-xl md:text-2xl font-semibold grad break-all">{getValue('contact','email') || 'jyotiiyadav812@gmail.com'}</a>
              <a href={`tel:${getValue('contact','phone')}`} className="block mt-3 text-lg font-medium text-[#25243A]/80 hover:text-[#8B5CF6] transition">📞 {getValue('contact','phone') || '+91 93506 06197'}</a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {Object.entries(contact?.links || {}).map(([k,v]) => (
                <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium text-[#25243A]/85 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:!bg-gradient-to-br hover:from-[#8B5CF6] hover:to-[#67DDF5] hover:shadow-[0_8px_24px_rgba(139,92,246,.45)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">{k==='LinkedIn'?<path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2 3.77-2 4.03 0 4.77 2.6 4.77 6V21h-4v-4.9c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-4z"/>:k==='GitHub'?<path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 016 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0023.5 12C23.5 5.7 18.3.5 12 .5z"/>:<path fill="currentColor" d="M3 3h18v18H3z" />}</svg>
                  {k}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28 px-5 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[.3em] uppercase text-[#8B5CF6] font-semibold mb-3">FAQ</p>
              <h2 className="text-3xl md:text-5xl font-bold grad pb-1">Frequently asked questions</h2>
            </div>
            <div className="grid lg:grid-cols-5 gap-10 items-start">
              <div className="lg:col-span-2">
                <div className="glass gb rounded-3xl p-7 text-center lg:text-left">
                  <div className="text-5xl fl inline-block" style={{ animation: "blink 1s step-end infinite" }}>💬</div>
                  <h3 className="mt-4 text-2xl font-bold">Got a question? <span className="grad">Ask away.</span></h3>
                  <p className="mt-3 text-sm text-[#25243A]/70 leading-relaxed" contentEditable={isEdited('contact','form_note')} onInput={e => setEdit('contact','form_note',e.target.textContent)}>{getValue('contact','form_note') || 'Fill this in and your message will be saved.'}</p>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-3">
                {faq.items.map((q, i) => (
                  <div key={i} className="glass gb rounded-2xl transition-shadow duration-300">
                    <button type="button" className="w-full flex items-center gap-4 p-4 sm:p-5 text-left">
                      <span className="w-11 h-11 shrink-0 rounded-xl grid place-items-center text-xl bg-gradient-to-br from-[#8B5CF6]/15 to-[#67DDF5]/25">{q.icon || '✦'}</span>
                      <span className="flex-1 font-semibold" contentEditable={isEdited(`faq.items.${i}.question`)} onInput={e => setEdit(`faq.items.${i}.question`,e.target.textContent)}>{q.question || 'Question'}</span>
                      <span className="w-8 h-8 shrink-0 rounded-full grid place-items-center text-lg text-white bg-gradient-to-br from-[#8B5CF6] to-[#67DDF5]">+</span>
                    </button>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pl-[4.75rem] sm:pl-[5.25rem] text-sm sm:text-base text-[#25243A]/75 leading-relaxed" contentEditable={isEdited(`faq.items.${i}.answer`)} onInput={e => setEdit(`faq.items.${i}.answer`,e.target.textContent)}>{q.answer || 'Answer'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative px-5 pt-16 pb-8 overflow-hidden" style={{ background: "linear-gradient(180deg,#F8F7FF,#EFEAFF)" }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="glass gb rounded-3xl p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative z-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold grad pb-1" contentEditable={isEdited('footer','cta_title')} onInput={e => setEdit('footer','cta_title',e.target.textContent)}>{getValue('footer','cta_title') || 'Have an idea or opportunity?'}</h3>
              <p className="mt-2 text-[#25243A]/70" contentEditable={isEdited('footer','cta_text')} onInput={e => setEdit('footer','cta_text',e.target.textContent)}>{getValue('footer','cta_text') || "Let's connect and create something great together."}</p>
            </div>
            <a href={`mailto:${getValue('contact','email')}`} className="glass inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium text-[#25243A]/85 transition-all hover:-translate-y-1 hover:text-white hover:!bg-gradient-to-br hover:from-[#8B5CF6] hover:to-[#67DDF5]">Let's Connect</a>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
            <div>
              <a href="#home" className="text-2xl font-bold grad" contentEditable={isEdited('site','name')} onInput={e => setEdit('site','name',e.target.textContent)}>{getValue('site','name') || 'Jyoti Yadav'}</a>
              <p className="mt-3 text-sm text-[#25243A]/65 max-w-xs mx-auto sm:mx-0 leading-relaxed" contentEditable={isEdited('footer','tagline')} onInput={e => setEdit('footer','tagline',e.target.textContent)}>{getValue('footer','tagline') || 'Aspiring web developer, AI tools explorer and digital creator.'}</p>
              <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-2">
                {Object.entries(contact?.links || {}).map(([k,v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium text-[#25243A]/85 transition-all hover:-translate-y-1 hover:text-white hover:!bg-gradient-to-br hover:from-[#8B5CF6] hover:to-[#67DDF5]">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">{k==='LinkedIn'?<path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2 3.77-2 4.03 0 4.77 2.6 4.77 6V21h-4v-4.9c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-4z"/>:k==='GitHub'?<path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 016 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0023.5 12C23.5 5.7 18.3.5 12 .5z"/>:<path fill="currentColor" d="M3 3h18v18H3z" />}</svg>
                    {k}
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden sm:block">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                {navItems.filter(i => i.visible !== false).map((n,i) => (
                  <li key={i}><a href={n.url} className="text-sm text-[#25243A]/70 hover:text-[#8B5CF6] transition">{n.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="hidden sm:block">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Expertise</h3>
              <ul className="space-y-2.5">
                {footer.expertise.map((x,i) => (
                  <li key={i}><a href="#skills" className="text-sm text-[#25243A]/70 hover:text-[#8B5CF6] transition" contentEditable={isEdited(`footer.expertise.${i}`)} onInput={e => setEdit(`footer.expertise.${i}`,e.target.textContent)}>{x || 'Expertise'}</a></li>
                ))}
              </ul>
            </div>
            <div className="hidden sm:block">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#8B5CF6]"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
                  <a href={`mailto:${getValue('contact','email')}`} className="text-sm text-[#25243A]/70 hover:text-[#8B5CF6] transition break-all">{getValue('contact','email')}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#8B5CF6]"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>
                  <a href={`tel:${getValue('contact','phone')}`} className="text-sm text-[#25243A]/70 hover:text-[#8B5CF6] transition">{getValue('contact','phone')}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-[#B69CFF]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#25243A]/60">
            <p>© {new Date().getFullYear()} {getValue('footer','copyright') || 'Jyoti Yadav. All rights reserved.'}</p>
            <p className="font-medium">{getValue('footer','credit') || 'Designed with creativity by Jyoti Yadav'}</p>
            <a href="#home" className="inline-flex items-center gap-2 hover:text-[#8B5CF6] transition">Back to top <span className="w-8 h-8 rounded-full glass grid place-items-center" aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>

      {/* Save bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex gap-2">
        <button onClick={save} disabled={saving} className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#67DDF5] text-white rounded-full font-bold shadow-lg shadow-purple-300/50 hover:shadow-[0_0_34px_rgba(139,92,246,.55)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2">
          <Save size={18} /> {saving ? 'Saving...' : 'Save all changes'}
        </button>
        <a href="/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-[#B69CFF]/40 text-[#25243A] font-medium hover:bg-[#F3EDFF] transition flex items-center gap-2">
          <ExternalLink size={16} /> View site
        </a>
      </div>

      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm shadow-xl">
          {error}
        </div>
      )}
    </div>
  );
}

function EditBtn({ section, field, value, label }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="absolute -top-8 -right-4 opacity-0 group-hover:opacity-100 transition-opacity" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button onClick={() => {}} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] shadow-sm hover:bg-white transition">
        <Pencil size={14} /> {label}
      </button>
    </div>
  );
}

function ImageBtn({ section, field, value, label }) {
  return (
    <div className="absolute -top-6 -right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Simple preview - in production upload to Supabase storage
        const url = URL.createObjectURL(file);
        setEdit(section, field, url);
      }} />
      <label className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur border border-[#B69CFF]/40 text-xs font-medium text-[#8B5CF6] shadow-sm cursor-pointer hover:bg-white transition">
        <Pencil size={14} /> {label}
      </label>
    </div>
  );
}

function Ring({ v }) {
  const r = 26, c = 2 * Math.PI * r, off = c * (1 - v / 100);
  return (
    <svg viewBox="0 0 64 64" className="w-6 h-6 -rotate-90">
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#67DDF5" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(182,156,255,.25)" strokeWidth="6" />
      <circle cx="32" cy="32" r={r} fill="none" stroke="url(#rg)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
    </svg>
  );
}
