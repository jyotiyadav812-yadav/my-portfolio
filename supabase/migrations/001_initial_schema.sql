create table site_settings (
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
insert into site_settings (id, site_name, hero_title) values (1, 'My Site', 'Welcome');

create table nav_links (
  id bigint generated always as identity primary key,
  label text not null,
  url text not null,
  sort_order int default 0,
  is_visible boolean default true
);

create table tools (
  id bigint generated always as identity primary key,
  name text not null,
  icon_url text,
  sort_order int default 0
);

create table projects (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  image_url text,
  link text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table features (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  icon_url text,
  sort_order int default 0
);

create table footer_links (
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
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('create policy "admin insert" on %I for insert with check (is_admin())', t);
    execute format('create policy "admin update" on %I for update using (is_admin())', t);
    execute format('create policy "admin delete" on %I for delete using (is_admin())', t);
    execute format('grant select on %I to anon, authenticated', t);
    execute format('grant insert, update, delete on %I to authenticated', t);
  end loop;
end $$;

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "admin upload" on storage.objects for insert
  with check (bucket_id = 'site-images' and is_admin());
create policy "admin update files" on storage.objects for update
  using (bucket_id = 'site-images' and is_admin());
create policy "admin delete files" on storage.objects for delete
  using (bucket_id = 'site-images' and is_admin());

notify pgrst, 'reload schema';
