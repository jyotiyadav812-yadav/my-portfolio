insert into public.admin_users (email)
select email from auth.users
order by created_at desc
limit 1
on conflict (email) do nothing;

select email, (email_confirmed_at is not null) as confirmed
from auth.users
order by created_at desc
limit 1;

notify pgrst, 'reload schema';
