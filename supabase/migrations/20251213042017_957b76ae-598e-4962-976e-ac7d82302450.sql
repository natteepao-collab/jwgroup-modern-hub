-- Insert Christmas theme setting
INSERT INTO public.site_content (section_key, content_th, content_en, content_cn, title_th, title_en, title_cn)
VALUES ('christmas_theme', 'true', 'true', 'true', 'ธีมคริสต์มาส', 'Christmas Theme', '圣诞主题')
ON CONFLICT (section_key) DO NOTHING;