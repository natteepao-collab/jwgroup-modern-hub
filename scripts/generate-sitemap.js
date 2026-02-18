import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.jwgroupthailand.com';

// Static routes
const staticRoutes = [
    '',
    '/about',
    '/about/history',
    '/about/vision',
    '/about/structure',
    '/about/team',
    '/about/awards',
    '/business',
    '/awards',
    '/premium-search',
    '/news',
    '/careers',
    '/contact',
    '/privacy',
    '/terms',
    '/pdpa',
    '/sustainability',
    '/vision-mission',
];

async function generateSitemap() {
    console.log('Starting sitemap generation...');

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Warning: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing. Skipping sitemap generation.');
        process.exit(0);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch dynamic routes (News)
    const { data: newsItems, error } = await supabase
        .from('news')
        .select('id, updated_at, created_at')
        .eq('is_published', true);

    if (error) {
        console.error('Error fetching news:', error);
        process.exit(1);
    }

    const dynamicRoutes = (newsItems || []).map((item) => ({
        url: `/news/${item.id}`,
        lastModified: item.updated_at || item.created_at,
    }));

    // Generate XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static routes
    staticRoutes.forEach((route) => {
        sitemap += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Add dynamic routes
    dynamicRoutes.forEach((route) => {
        sitemap += `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${new Date(route.lastModified).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    // Ensure public directory exists (it should in a standard Vite project)
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap.xml
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('✅ sitemap.xml generated in public/');

    // Generate robots.txt
    const robotsTxt = `User-agent: *
Disallow: /admin/
Disallow: /auth/

Sitemap: ${BASE_URL}/sitemap.xml`;

    // Write robots.txt
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    console.log('✅ robots.txt generated in public/');
}

generateSitemap().catch((err) => {
    console.error(err);
    process.exit(1);
});
