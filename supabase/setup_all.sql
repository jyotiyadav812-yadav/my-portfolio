create table if not exists public.site_settings (
  id int primary key default 1,
  site_name text,
  logo_url text,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  hero_button_text text,
  hero_button_link text,
  constraint site_settings_single_row check (id = 1)
);

insert into public.site_settings (id, site_name, hero_title)
values (1, 'My Site', 'Welcome')
on conflict (id) do nothing;

create table if not exists public.nav_links (
  id bigint generated always as identity primary key,
  label text not null,
  url text not null,
  sort_order int default 0,
  is_visible boolean default true
);

create table if not exists public.tools (
  id bigint generated always as identity primary key,
  name text not null,
  icon_url text,
  sort_order int default 0
);

create table if not exists public.projects (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  image_url text,
  link text,
  sort_order int default 0,
  gradient text default '#8B5CF6,#67DDF5',
  emoji text default '✦',
  created_at timestamptz default now()
);

create table if not exists public.features (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  icon_url text,
  sort_order int default 0
);

create table if not exists public.footer_links (
  id bigint generated always as identity primary key,
  label text not null,
  url text not null,
  sort_order int default 0
);

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'admin_users_email_not_empty'
      and conrelid = 'public.admin_users'::regclass
  ) then
    delete from public.admin_users where email = '';
    alter table public.admin_users
      add constraint admin_users_email_not_empty check (email <> '');
  end if;
end $$;

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admin_users admin select" on public.admin_users;
create policy "admin_users admin select" on public.admin_users
  for select to authenticated using (public.is_admin());

drop policy if exists "admin_users admin insert" on public.admin_users;
create policy "admin_users admin insert" on public.admin_users
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admin_users admin delete" on public.admin_users;
create policy "admin_users admin delete" on public.admin_users
  for delete to authenticated
  using (
    public.is_admin()
    and lower(email) <> lower(coalesce(auth.jwt() ->> 'email', ''))
  );

grant select, insert, delete on public.admin_users to authenticated;

insert into public.admin_users (email)
select email from auth.users
where email is not null and email <> ''
order by created_at desc
limit 1
on conflict (email) do nothing;

insert into public.admin_users (email)
values ('jyotiiyadav812@gmail.com')
on conflict (email) do nothing;

do $$
declare t text;
begin
  foreach t in array array['site_settings','nav_links','tools','projects','features','footer_links']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('drop policy if exists "admin insert" on %I', t);
    execute format('create policy "admin insert" on %I for insert with check (public.is_admin())', t);
    execute format('drop policy if exists "admin update" on %I', t);
    execute format('create policy "admin update" on %I for update using (public.is_admin())', t);
    execute format('drop policy if exists "admin delete" on %I', t);
    execute format('create policy "admin delete" on %I for delete using (public.is_admin())', t);
    execute format('grant select on %I to anon, authenticated', t);
    execute format('grant insert, update, delete on %I to authenticated', t);
  end loop;
end $$;

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now()
);

alter table public.site_content enable row level security;
alter table public.messages enable row level security;

drop policy if exists "site_content public select" on public.site_content;
create policy "site_content public select" on public.site_content
  for select using (true);
drop policy if exists "site_content admin insert" on public.site_content;
create policy "site_content admin insert" on public.site_content
  for insert with check (public.is_admin());
drop policy if exists "site_content admin update" on public.site_content;
create policy "site_content admin update" on public.site_content
  for update using (public.is_admin());
drop policy if exists "site_content admin delete" on public.site_content;
create policy "site_content admin delete" on public.site_content
  for delete using (public.is_admin());
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

drop policy if exists "messages public select" on public.messages;
drop policy if exists "messages admin select" on public.messages;
create policy "messages admin select" on public.messages
  for select to authenticated using (public.is_admin());
revoke select on public.messages from anon;
grant select on public.messages to authenticated;

drop policy if exists "messages admin insert" on public.messages;
drop policy if exists "messages public insert" on public.messages;
create policy "messages public insert" on public.messages
  for insert to anon, authenticated with check (true);
grant insert on public.messages to anon, authenticated;

drop policy if exists "messages admin update" on public.messages;
create policy "messages admin update" on public.messages
  for update to authenticated using (public.is_admin());
drop policy if exists "messages admin delete" on public.messages;
create policy "messages admin delete" on public.messages
  for delete to authenticated using (public.is_admin());
grant update, delete on public.messages to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

create or replace function public.limit_message_rate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*)
    from public.messages
    where lower(email) = lower(new.email)
      and created_at > now() - interval '1 minute'
  ) >= 3 then
    raise exception 'Too many messages. Please try again later.';
  end if;
  return new;
end;
$$;

drop trigger if exists messages_rate_limit on public.messages;
create trigger messages_rate_limit
before insert on public.messages
for each row execute function public.limit_message_rate();

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "site images public read" on storage.objects;
create policy "site images public read" on storage.objects
  for select using (bucket_id = 'site-images');

drop policy if exists "admin upload" on storage.objects;
create policy "admin upload" on storage.objects for insert
  with check (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "admin update files" on storage.objects;
create policy "admin update files" on storage.objects for update
  using (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "admin delete files" on storage.objects;
create policy "admin delete files" on storage.objects for delete
  using (bucket_id = 'site-images' and public.is_admin());

insert into public.site_content (key, value) values
  ('site', '{"name":"Jyoti Yadav","title":"Jyoti Yadav | Aspiring Web Developer & AI Tools Enthusiast","description":"Portfolio of Jyoti Yadav: aspiring web developer, AI tools enthusiast and digital creator.","logo_url":""}'::jsonb),
  ('nav', '{"items":[{"label":"Home","url":"#home","visible":true},{"label":"About","url":"#about","visible":true},{"label":"Skills","url":"#skills","visible":true},{"label":"AI Tools","url":"#aitools","visible":true},{"label":"Projects","url":"#projects","visible":true},{"label":"Education","url":"#education","visible":true},{"label":"Contact","url":"#contact","visible":true},{"label":"FAQ","url":"#faq","visible":true}]}'::jsonb),
  ('hero', '{"badge":"Digital Marketing with AI · Pursuing","greeting":"Hi,","name":"Jyoti Yadav","subtitle":"Frontend Developer","description":"I blend creativity with technology, building clean, responsive websites, exploring the latest AI tools and creating videos and digital content that tell great stories.","primary_text":"Explore My Work","primary_link":"#projects","secondary_text":"Let’s Connect","secondary_link":"#contact","tags":[{"label":"Frontend Development","color":"#8B5CF6"},{"label":"AI Tools & Prompt Engineering","color":"#67DDF5"},{"label":"Video Editing","color":"#FFB6D9"}],"image_url":""}'::jsonb),
  ('profile', '{"name":"Jyoti Yadav","headline":"Aspiring Web Developer & AI Tools Enthusiast","titles":["Frontend Developer","AI Tools Explorer","Creative Video Editor","Digital Marketing Enthusiast"],"about":"I am Jyoti Yadav, a curious learner exploring the space where *web development*, *AI tools* and *digital creativity* meet. I enjoy turning ideas into *clean, usable websites* and experimenting with *AI-assisted development*, and I am currently pursuing a *Digital Marketing with AI* course.","photo_url":"","photo_wide_url":"","caption":"💡 Better ideas, bigger goals","showcase_caption":"✨ Human creativity × AI"}'::jsonb),
  ('skills', '{"items":[{"name":"HTML","description":"Semantic, accessible markup","icon":"</>"},{"name":"CSS","description":"Layouts, styling & polish","icon":"✦"},{"name":"JavaScript","description":"Interactive basics","icon":"JS"},{"name":"Frontend Web Development","description":"Building responsive UIs","icon":"◧"},{"name":"AI Tools & Prompt Engineering","description":"Getting the best out of AI","icon":"AI"},{"name":"Video Editing","description":"Stories told in motion","icon":"▶"},{"name":"Graphic Designing","description":"Eye-catching visuals","icon":"◐"},{"name":"Digital Marketing","description":"Reaching the right audience","icon":"◎"},{"name":"SEO","description":"Helping sites get found","icon":"⌕"},{"name":"Content Creation","description":"Ideas turned into content","icon":"✎"},{"name":"Website Designing","description":"Clean, modern layouts","icon":"◈"},{"name":"Social Media Management","description":"Building a presence online","icon":"@"},{"name":"Creative Problem-Solving","description":"Fresh ideas for real challenges","icon":"✧"}],"soft_skills":["Time Management","Teamwork","Adaptability","Learning Ability"],"marquee":["Web Development","AI Tools","Video Editing","Digital Marketing","SEO","Content Creation","Graphic Designing","Social Media"]}'::jsonb),
  ('tools', '{"items":[{"name":"ChatGPT","description":"Conversational AI for brainstorming, writing and learning.","color":"#10A37F","logo_url":""},{"name":"Google Gemini","description":"Google’s multimodal AI for ideas, research and code.","color":"#9B72CB","logo_url":""},{"name":"Claude","description":"Thoughtful AI assistant for writing, analysis and coding.","color":"#D97757","logo_url":""},{"name":"Canva AI","description":"Design assistant for quick, beautiful visuals.","color":"#7D2AE8","logo_url":""},{"name":"Microsoft Copilot","description":"AI companion across Microsoft apps and the web.","color":"#2F8BFF","logo_url":""},{"name":"Perplexity AI","description":"Answer engine with sourced, up-to-date research.","color":"#20808D","logo_url":""},{"name":"GitHub Copilot","description":"AI pair programmer inside the code editor.","color":"#24292F","logo_url":""},{"name":"Google AI Studio","description":"Google’s playground for prototyping with Gemini and building AI apps.","color":"#4285F4","logo_url":""},{"name":"Suno AI","description":"Turns text prompts into full songs with vocals and music.","color":"#555566","logo_url":""},{"name":"ElevenLabs","description":"Realistic AI voiceovers, text-to-speech and voice tools.","color":"#25243A","logo_url":""},{"name":"CapCut","description":"Popular video editor with templates, effects and AI features.","color":"#444455","logo_url":""}],"showcase_title":"Where ideas meet intelligence","showcase_text":"AI isn’t a shortcut for me, it’s a creative co-pilot. I explore tools like ChatGPT, Gemini, Claude, Google AI Studio, Suno, ElevenLabs and CapCut to turn a spark of an idea into websites, music, voices and videos.","quote":"Tools change every day. Curiosity never goes out of style.","chips":["Ideate","Build","Create","Repeat"]}'::jsonb),
  ('education', '{"intro":"From school boards to AI-powered marketing, every step has added a new skill to my toolkit.","items":[{"title":"10th","place":"HBSE","year":"","score":79.8,"tag":"Foundation","tagline":"Where it all began","emoji":"📘","icon":"10","grow":"🌱","chips":[]},{"title":"12th (Arts)","place":"HBSE","year":"","score":90.2,"tag":"Higher Secondary","tagline":"Scoring higher, dreaming bigger","emoji":"📖","icon":"12","grow":"🌿","chips":["Arts stream"]},{"title":"Bachelor of Arts","place":"Kurukshetra University","year":"","score":60,"tag":"Graduation","tagline":"Broadening my horizons","emoji":"🎓","icon":"BA","grow":"🌳","chips":[]},{"title":"Digital Marketing with AI","place":"Course","year":"","score":null,"tag":"Present","tagline":"Where marketing meets AI","emoji":"📈","icon":"AI","grow":"🌸","chips":["Digital Marketing","AI Tools"]}]}'::jsonb),
  ('faq', '{"items":[{"icon":"👋","question":"Who is Jyoti Yadav?","answer":"I am an aspiring web developer, AI tools enthusiast and digital creator. I am currently pursuing a Digital Marketing with AI course and love turning ideas into clean, usable websites."},{"icon":"🛠️","question":"What skills do you have?","answer":"HTML, CSS and JavaScript basics, frontend development and website designing, plus video editing, graphic designing, SEO, digital marketing, content creation, social media management and AI tools & prompt engineering."},{"icon":"🤖","question":"Which AI tools do you use?","answer":"I explore ChatGPT, Gemini, Claude, Google AI Studio, Canva AI, Suno AI, ElevenLabs, CapCut, Microsoft Copilot, Perplexity and GitHub Copilot to ideate, build and create faster."},{"icon":"🎮","question":"What projects have you worked on?","answer":"A 3D Road Runner game made with Google AI Studio, an AI Student Career Agent (concept) and a website for a Common Service Centre (CSC). You can find them in the Projects section."},{"icon":"🎓","question":"What is your educational background?","answer":"10th from HBSE with 79.8%, 12th (Arts) from HBSE with 90.2%, a Bachelor of Arts from Kurukshetra University with 60%, and I am now pursuing Digital Marketing with AI."},{"icon":"📚","question":"What are you learning right now?","answer":"Digital Marketing with AI is my current course, and I keep practising web development and AI-assisted development alongside it."},{"icon":"📬","question":"How can I contact you?","answer":"Email me, call me, or message me on LinkedIn, GitHub or Instagram. All the links are in the Contact section and the footer."}]}'::jsonb),
  ('contact', '{"email":"jyotiiyadav812@gmail.com","phone":"+91 93506 06197","linkedin":"https://www.linkedin.com/in/jyoti-yadav-b5b2a743a","github":"https://github.com/jyotiyadav812-yadav","instagram":"https://www.instagram.com/yadavjyoti812","intro":"Have an idea or opportunity? I’d love to hear from you.","form_note":"Fill this in and your message will be saved. Your email app can also open with a copy ready to send."}'::jsonb),
  ('footer', '{"tagline":"Aspiring web developer, AI tools explorer and digital creator.","copyright":"Jyoti Yadav. All rights reserved.","credit":"Designed with creativity by Jyoti Yadav","logo_url":"","cta_title":"Have an idea or opportunity?","cta_text":"Let’s connect and create something great together.","links":[{"label":"About","url":"#about"},{"label":"Skills","url":"#skills"},{"label":"AI Tools","url":"#aitools"},{"label":"Projects","url":"#projects"},{"label":"Education","url":"#education"},{"label":"Contact","url":"#contact"},{"label":"FAQ","url":"#faq"}],"expertise":["Frontend Development","AI Tools & Prompt Engineering","Video Editing","Digital Marketing"]}'::jsonb),
  ('style', '{"font":"Plus Jakarta Sans","primary":"#8B5CF6","accent":"#67DDF5"}'::jsonb)
on conflict (key) do nothing;

alter table public.projects add column if not exists gradient text default '#8B5CF6,#67DDF5';
alter table public.projects add column if not exists emoji text default '✦';

insert into public.projects (title, description, gradient, emoji, link, sort_order)
select v.title, v.description, v.gradient, v.emoji, v.link, v.sort_order
from (values
  ('3D Road Runner Game'::text, 'A 3D endless-runner game created with Google AI Studio.'::text, '#8B5CF6,#67DDF5'::text, '🎮'::text, ''::text, 1::int),
  ('AI Student Career Agent', 'A concept for an AI agent that helps students explore career paths.', '#B69CFF,#FFD6EA', '🧭', '', 2),
  ('CSC Centre Website', 'A website for a Common Service Centre, built with a modern React stack.', '#67DDF5,#B69CFF', '🌐', '', 3)
) as v(title, description, gradient, emoji, link, sort_order)
where not exists (select 1 from public.projects);

alter table public.site_settings add column if not exists seo_title text;
alter table public.site_settings add column if not exists seo_description text;
alter table public.site_settings add column if not exists og_image_url text;
alter table public.site_settings add column if not exists keywords text;

insert into public.site_settings (id, seo_title, seo_description, og_image_url, keywords)
values (
  1,
  'Jyoti Yadav | Aspiring Web Developer & AI Tools Enthusiast',
  'Portfolio of Jyoti Yadav: aspiring web developer, AI tools enthusiast and digital creator.',
  'https://jyotiyadav812-yadav.github.io/my-portfolio/ogimage.png',
  'Jyoti Yadav, web developer, frontend developer, AI tools, digital marketing, video editing, SEO'
)
on conflict (id) do update
  set seo_title = coalesce(public.site_settings.seo_title, excluded.seo_title),
      seo_description = coalesce(public.site_settings.seo_description, excluded.seo_description),
      og_image_url = coalesce(public.site_settings.og_image_url, excluded.og_image_url),
      keywords = coalesce(public.site_settings.keywords, excluded.keywords);

notify pgrst, 'reload schema';
