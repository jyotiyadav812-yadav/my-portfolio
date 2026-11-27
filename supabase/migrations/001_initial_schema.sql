create table if not exists site_settings (
  id int primary key default 1,
  site_name text,
  logo_url text,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  hero_button_text text,
  hero_button_link text,
  constraint single_row check (id = 1)
);
insert into site_settings (id, site_name, hero_title) values (1, 'My Site', 'Welcome')
on conflict (id) do nothing;

create table if not exists nav_links (
  id bigint generated always as identity primary key,
  label text not null,
  url text not null,
  sort_order int default 0,
  is_visible boolean default true
);

create table if not exists tools (
  id bigint generated always as identity primary key,
  name text not null,
  icon_url text,
  sort_order int default 0
);

create table if not exists projects (
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

create table if not exists features (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  icon_url text,
  sort_order int default 0
);

create table if not exists footer_links (
  id bigint generated always as identity primary key,
  label text not null,
  url text not null,
  sort_order int default 0
);

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

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "admin upload" on storage.objects;
create policy "admin upload" on storage.objects for insert
  with check (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "admin update files" on storage.objects;
create policy "admin update files" on storage.objects for update
  using (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "admin delete files" on storage.objects;
create policy "admin delete files" on storage.objects for delete
  using (bucket_id = 'site-images' and public.is_admin());

notify pgrst, 'reload schema';
