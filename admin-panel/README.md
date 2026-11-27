# Portfolio Admin Panel

Password-protected CMS for the static portfolio in `../portfolio`. All portfolio sections, images, links, fonts and colors are edited here and saved to Supabase; the public page reads them with `portfolio/cms.js`.

## 1. Install and configure

```bash
cd admin-panel
npm install
cp .env.example .env
```

Fill `.env`:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — publishable/anon key (safe for browser use; access is controlled by RLS)
- `VITE_SITE_URL` — link used by the “View portfolio” button (e.g. `/portfolio/index.html` or the deployed URL)

## 2. Create the login first

Only emails in `admin_users` can sign in. In Supabase, open **Authentication → Users → Add user**, create the admin account, and make sure it is confirmed if email confirmation is enabled. Create this user **before** running the SQL setup so the allow-list can be seeded correctly.

## 3. Database setup

Easiest option: open the Supabase SQL editor, paste the whole contents of `supabase/setup_all.sql`, and click **Run**. It is idempotent, so it can be run again safely.

If you prefer the separate migration files, run these in order:

1. `supabase/migrations/000_admin_auth.sql` — admin allow-list and `is_admin()` function
2. `supabase/migrations/001_initial_schema.sql` — base tables and storage bucket
3. `supabase/migrations/002_site_content_messages.sql` — content and message tables
4. `supabase/migrations/003_cms_defaults_and_policies.sql` — default content, public read rules, safe message submission rules

Both options add the newest existing Auth user to the allow-list. If you add or replace the user later, run `supabase/add_current_admin.sql` to refresh it.

Existing admins can add or remove others from **Admins** inside the panel, and can change their own email or password from **Account**. When changing your email there, confirm the new address before removing the old one from the allow-list.

## 4. Run

```bash
npm run dev
```

Open `http://localhost:5173/login`. Use the same URL with `/admin` for the dashboard.

Other commands:

```bash
npm run lint
npm run build
npm run preview
```

For deployment, set `VITE_SITE_URL`, run `npm run build`, serve `dist/`, and configure a single-page-app rewrite to `index.html`.

## 5. Connect the public portfolio

`portfolio/cms.js` is included by `portfolio/index.html`. It reads `site_content` and `projects`, then re-renders the page. It falls back to the built-in content if Supabase cannot be reached.

It uses the Supabase URL and publishable key already present in `portfolio/.env`. For a different project, either edit the constants at the top of `portfolio/cms.js` or define these globals before the script:

```html
<script>
  window.PORTFOLIO_SUPABASE_URL = 'https://your-project.supabase.co';
  window.PORTFOLIO_SUPABASE_KEY = 'your-publishable-key';
</script>
<script src="cms.js"></script>
```

Deploy `index.html` and `cms.js` together. Changes saved in the admin panel appear on a page reload.

## Sections you can edit

Dashboard, Site & Hero, Navigation, Profile, Skills, AI Tools, Projects, Education, FAQ, Contact, Footer, Style & Fonts, Messages, Admins, Account.
