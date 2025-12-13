-- Add snowfall animation setting to site_content
INSERT INTO public.site_content (section_key, title_th, title_en, title_cn, content_th, content_en, content_cn)
VALUES (
  'snowfall_animation',
  'Animation หิมะตก',
  'Snowfall Animation',
  '雪花动画',
  'true',
  'true',
  'true'
) ON CONFLICT (section_key) DO NOTHING;