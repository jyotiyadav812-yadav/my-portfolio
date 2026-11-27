create table if not exists site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now()
);

alter table site_content enable row level security;
alter table messages enable row level security;

create policy "site_content public select" on site_content
  for select using (true);
create policy "site_content admin insert" on site_content
  for insert with check (is_admin());
create policy "site_content admin update" on site_content
  for update using (is_admin());
create policy "site_content admin delete" on site_content
  for delete using (is_admin());
grant select on site_content to anon, authenticated;
grant insert, update, delete on site_content to authenticated;

create policy "messages public select" on messages
  for select using (true);
create policy "messages admin insert" on messages
  for insert with check (is_admin());
create policy "messages admin update" on messages
  for update using (is_admin());
create policy "messages admin delete" on messages
  for delete using (is_admin());
grant select on messages to anon, authenticated;
grant insert, update, delete on messages to authenticated;

notify pgrst, 'reload schema';
