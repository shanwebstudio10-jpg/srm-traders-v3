// Runs before every build. Writes sitemap.xml and robots.txt using VITE_SITE_URL (set it in Cloudflare Pages).
import { writeFileSync } from 'fs';

const site = (process.env.VITE_SITE_URL || '').replace(/\/$/, '');
const pages = ['', '/products', '/corporate-gifting', '/about', '/contact'];
if (site) {
  const urls = pages.map((p) => `  <url><loc>${site}${p}</loc></url>`).join('\n');
  writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
  console.log('SEO files written for', site);
} else {
  writeFileSync('public/robots.txt', 'User-agent: *\nAllow: /\n');
  console.log('VITE_SITE_URL not set - sitemap skipped');
}
