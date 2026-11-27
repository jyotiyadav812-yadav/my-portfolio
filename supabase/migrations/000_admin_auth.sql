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

notify pgrst, 'reload schema';
