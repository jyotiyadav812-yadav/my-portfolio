(function () {
  const url = window.PORTFOLIO_SUPABASE_URL || 'https://solmqrqfvijsomtrzdet.supabase.co';
  const key = window.PORTFOLIO_SUPABASE_KEY || 'sb_publishable_XBA2ZWfZkRa9sBzv21Tk3w_NEchAEIr';
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

  window.portfolioSendMessage = async function (payload) {
    try {
      const response = await fetch(`${url}/rest/v1/messages`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch (error) {
      console.warn('Message could not be saved to Supabase', error);
      return false;
    }
  };

  function replaceArray(target, next) {
    target.splice(0, target.length, ...next);
  }

  async function readTable(table, query) {
    const response = await fetch(`${url}/rest/v1/${table}?${query}`, { headers });
    if (!response.ok) throw new Error(`${table}: ${response.status}`);
    return response.json();
  }

  function applyStyle(style) {
    const font = style.font || 'Plus Jakarta Sans';
    const primary = /^#[0-9a-f]{6}$/i.test(style.primary || '') ? style.primary : '#8B5CF6';
    const accent = /^#[0-9a-f]{6}$/i.test(style.accent || '') ? style.accent : '#67DDF5';
    const family = font.replace(/\s/g, '+');

    let fontLink = document.getElementById('cms-google-font');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = 'cms-google-font';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    fontLink.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800&display=swap`;

    let css = document.getElementById('cms-style');
    if (!css) {
      css = document.createElement('style');
      css.id = 'cms-style';
      document.head.appendChild(css);
    }
    css.textContent = `
      :root{--pur:${primary};--cy:${accent};--lav:color-mix(in srgb,${primary} 55%,white);--font-body:"${font}",system-ui,sans-serif;--font-heading:"${font}",system-ui,sans-serif}
      body,button,input,textarea{font-family:var(--font-body)!important}
      h1,h2,h3{font-family:var(--font-heading)!important}
      .grad{background:linear-gradient(90deg,var(--pur),var(--cy),var(--lav),var(--pur))!important;background-size:300% 100%!important;-webkit-background-clip:text!important;background-clip:text!important}
      .caret{color:var(--pur)!important}
      [class*="text-[#8B5CF6]"]{color:var(--pur)!important}
      [class*="bg-[#8B5CF6]"]{background-color:var(--pur)!important}
      [class*="border-[#B69CFF]"]{border-color:var(--lav)!important}
      [class*="from-[#8B5CF6]"]{--tw-gradient-from:var(--pur)!important;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)!important}
      [class*="from-[#B69CFF]"]{--tw-gradient-from:var(--lav)!important;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)!important}
      [class*="to-[#B69CFF]"]{--tw-gradient-to:var(--lav)!important}
      [class*="to-[#67DDF5]"],[class*="via-[#67DDF5]"]{--tw-gradient-to:var(--cy)!important;--tw-gradient-via:var(--cy)!important}
    `;
  }

  function applyContent(content, projects) {
    const site = content.site || {};
    const hero = content.hero || {};
    const profile = content.profile || {};
    const contact = content.contact || {};
    const footer = content.footer || {};
    const skills = content.skills || {};
    const tools = content.tools || {};
    const education = content.education || {};
    const faq = content.faq || {};
    const nav = content.nav || {};

    if (Array.isArray(nav.items) && nav.items.length) {
      D.navItems = nav.items.filter((item) => item.visible !== false).map((item) => ({ label: item.label || '', url: item.url || '#' }));
    }

    D.siteName = site.name || profile.name || D.siteName;
    D.heroName = hero.name || profile.name || D.siteName;
    D.heroGreeting = hero.greeting || 'Hi,';
    D.heroBadge = hero.badge;
    D.heroSubtitle = hero.subtitle;
    D.heroDescription = hero.description;
    D.heroPrimaryText = hero.primary_text;
    D.heroPrimaryLink = hero.primary_link;
    D.heroSecondaryText = hero.secondary_text;
    D.heroSecondaryLink = hero.secondary_link;
    D.heroTags = Array.isArray(hero.tags) && hero.tags.length
      ? hero.tags.map((tag) => [tag.label || '', tag.color || '#8B5CF6'])
      : null;
    if (hero.image_url) D.photo = hero.image_url;

    if (site.title) document.title = site.title;
    if (site.description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', site.description);
    }

    if (Array.isArray(profile.titles) && profile.titles.length) D.titles = profile.titles;
    if (profile.about) D.about = profile.about;
    if (profile.photo_url) {
      D.photo = profile.photo_url;
      D.photoFull = profile.photo_url;
    }
    if (profile.photo_wide_url) D.photoWide = profile.photo_wide_url;
    if (profile.caption) D.caption = profile.caption;
    if (profile.showcase_caption) D.showcaseCaption = profile.showcase_caption;

    if (Array.isArray(skills.items) && skills.items.length) {
      replaceArray(
        SKILLS,
        skills.items.map((item) => [item.name || '', item.description || '', item.icon || '✦'])
      );
    }
    if (Array.isArray(skills.soft_skills) && skills.soft_skills.length) D.softSkills = skills.soft_skills;
    if (Array.isArray(skills.marquee) && skills.marquee.length) D.marquee = skills.marquee;

    if (Array.isArray(tools.items) && tools.items.length) {
      const heroNames = HERO.map((item) => item[0]);
      replaceArray(
        TOOLS,
        tools.items.map((item) => [item.name || '', item.description || '', item.color || '#8B5CF6'])
      );
      replaceArray(
        HERO,
        heroNames.map((name) => TOOLS.find((tool) => tool[0] === name)).filter(Boolean)
      );
      if (!D.logoImg) D.logoImg = {};
      tools.items.forEach((item) => {
        if (item.logo_url && item.name) D.logoImg[LK(item.name)] = item.logo_url;
      });
    }
    D.showcase = {
      title: tools.showcase_title,
      text: tools.showcase_text,
      quote: tools.quote,
      chips: Array.isArray(tools.chips) ? tools.chips : [],
    };

    if (Array.isArray(projects) && projects.length) {
      D.projects = projects.map((project) => [
        project.title || '',
        project.description || '',
        project.gradient || '#8B5CF6,#67DDF5',
        project.emoji || '✦',
        project.link || '',
        project.image_url || '',
      ]);
    }

    if (Array.isArray(education.items) && education.items.length) {
      D.edu = education.items.map((item) => ({
        title: item.title || item.degree || item.school || '',
        place: item.school || item.place || '',
        year: item.year || '',
        score: item.score === null || item.score === undefined || item.score === '' ? null : Number(item.score),
        tag: item.tag || 'Journey',
        tagline: item.tagline || item.degree || '',
        emoji: item.emoji || '✦',
        icon: item.icon || '✦',
        grow: item.grow || '🌱',
        chips: Array.isArray(item.chips) ? item.chips : [],
      }));
    }
    if (education.intro) D.eduIntro = education.intro;

    if (Array.isArray(faq.items) && faq.items.length) {
      D.faq = faq.items.map((item) => [item.icon || '✦', item.question || '', item.answer || '']);
    }

    if (contact.email) D.email = contact.email;
    if (contact.phone) {
      D.phone = contact.phone;
      D.phoneHref = 'tel:' + contact.phone.replace(/[^\d+]/g, '');
    }
    [
      ['linkedin', 'LinkedIn'],
      ['github', 'GitHub'],
      ['instagram', 'Instagram'],
    ].forEach(([key, label]) => {
      if (contact[key]) D.links[label] = contact[key];
    });
    if (contact.intro) D.contactIntro = contact.intro;
    if (contact.form_note) D.formNote = contact.form_note;

    D.footerInfo = footer;
    if (footer.logo_url) D.footerLogo = footer.logo_url;
    if (Array.isArray(footer.links) && footer.links.length) D.footerLinks = footer.links;
    if (Array.isArray(footer.expertise) && footer.expertise.length) D.footerExpertise = footer.expertise;

    if (content.style) applyStyle(content.style);
  }

  async function init() {
    const [rows, projects] = await Promise.all([
      readTable('site_content', 'select=key,value'),
      readTable('projects', 'select=title,description,image_url,link,gradient,emoji,sort_order&order=sort_order.asc'),
    ]);
    const content = {};
    rows.forEach((row) => {
      content[row.key] = row.value || {};
    });
    applyContent(content, projects);
    if (window.__renderCMS) window.__renderCMS();
    document.documentElement.dataset.cms = 'ready';
  }

  init().catch((error) => {
    console.warn('Portfolio is using its built-in content', error);
  });
})();
