-- SEO settings for the public portfolio (single-row table, id = 1)
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