# AGENTS.md

Repo: personal portfolio (`portfolio/`) + Supabase-backed admin panel (`admin-panel/`).

## Layout

- `admin-panel/` — Vite + React 19 SPA (React Router v7, Tailwind 4, lucide-react, `@supabase/supabase-js`). The CMS.
- `portfolio/` — static `index.html` + `cms.js`. Reads `site_content` and `projects` from Supabase, falls back to inline defaults. No build step.
- `supabase/` — `setup_all.sql` (idempotent, run this) and numbered `migrations/`. `add_current_admin.sql` re-seeds the admin allow-list from the newest Auth user.

## Commands (run inside `admin-panel/`)

- `npm run dev` — dev server on `:5173` (routes start at `/login`, `/admin`).
- `npm run lint` — oxlint. Some warnings are pre-existing; do not introduce new errors.
- `npm run build` — production build to `dist/`. Vite `base` is `/my-portfolio/admin/` for builds, `/` in dev.
- `npm run preview` — preview the build.
- No test framework is configured. Verify with lint + build, and manually exercise the UI.

## Admin panel architecture

- `src/App.jsx` — routes wrapped in `AuthProvider` → `BrowserRouter` → `DeleteGuardProvider` → `Routes`.
- `src/contexts/AuthContext.jsx` — Supabase email/password auth + `is_admin()` RPC allow-list. `ProtectedRoute` shows a spinner only until access is known; it must NOT unmount children on background auth events (token refresh) or unsaved form state is lost. `TOKEN_REFRESHED`/`USER_UPDATED` events are intentionally ignored, and repeat `SIGNED_IN` for the same user skips re-checking.
- `src/contexts/DeleteGuardContext.jsx` — `useDeleteGuard()` returns `confirmDelete({ title, description, confirmLabel })` → `Promise<boolean>`. It opens a modal and re-authenticates with `supabase.auth.signInWithPassword` using the logged-in email + entered password. Every destructive action (DB delete or removing an item from a form list, including images) must go through it. Do not use `window.confirm` for deletes.
- `src/hooks/useSiteContent.js` — loads/upserts one `site_content` row (`key`, JSON `value`) by key. Pages pass module-level `DEFAULTS` and `normalize` (keep them module-level so effect deps stay stable; inline functions cause reloads and wipe edits). Returns `{ form, setForm, loading, saving, error, toast, setToast, save }`.
- Tables used directly: `projects`, `messages`, `admin_users`. Content sections: `site_content` keys `site`, `hero`, `nav`, `profile`, `skills`, `tools`, `education`, `faq`, `contact`, `footer`, `style`.
- `src/components/ImageUpload.jsx` — uploads to the `site-images` storage bucket and stores the public URL.
- `src/components/EditorParts.jsx` — shared `SectionCard`, `StringListCard`, `RowActions`; row/list deletes already use the delete guard.

## Conventions

- Styling is inline Tailwind utility classes. Match the existing light/purple theme: `#8B5CF6` (primary), `#67DDF5` (accent), `#B69CFF` (border), `#25243A` (text), `glass` cards, gradient buttons.
- Pages are controlled forms that save via `useSiteContent.save()` (content) or direct Supabase calls (tables), then show a `Toast`.
- Any new delete/remove UI must call `useDeleteGuard()` before mutating state or the DB.
- Keep forms mounted during background auth events; never gate already-authorized content on transient `loading`/`adminLoading`.
- `src/pages/CMS.jsx` is a legacy combined editor and is not routed.

## Supabase

- Setup: create the admin user in Supabase Auth first, then run `supabase/setup_all.sql` in the SQL editor. RLS restricts writes to admins (`is_admin()`); the public site has read access.
- Env (`admin-panel/.env`, copy from `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`. Never commit real keys.
- `portfolio/cms.js` uses its own Supabase URL/key constants (or `window.PORTFOLIO_SUPABASE_URL` / `window.PORTFOLIO_SUPABASE_KEY` globals set before it loads).

## Manual verification

1. `cd admin-panel && npm run lint && npm run build`.
2. Start dev server; log in; edit a section, switch browser tabs away and back, confirm typed content is still there.
3. Add/edit/reorder/delete a project; deleting must prompt for the admin password (wrong password rejected).
4. Reload the public portfolio (serve `portfolio/` statically, e.g. `python3 -m http.server 8080 --directory portfolio`) and confirm changes appear after reload.
