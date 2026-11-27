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
drop policy if exists "messages public insert" on public.messages;
create policy "messages public insert" on public.messages
  for insert to anon, authenticated with check (true);
drop policy if exists "messages admin update" on public.messages;
create policy "messages admin update" on public.messages
  for update to authenticated using (public.is_admin());
drop policy if exists "messages admin delete" on public.messages;
create policy "messages admin delete" on public.messages
  for delete to authenticated using (public.is_admin());
revoke select on public.messages from anon;
grant select on public.messages to authenticated;
grant insert on public.messages to anon, authenticated;
grant update, delete on public.messages to authenticated;

notify pgrst, 'reload schema';
