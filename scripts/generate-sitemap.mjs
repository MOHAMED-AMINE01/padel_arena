/**
 * Génère public/sitemap.xml à partir de la liste des routes publiques.
 * Exécuté avant `vite build` (voir package.json) afin que le sitemap à jour
 * soit copié dans dist/ et servi à la racine du domaine.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const SITE_URL = 'https://padelarenavendome.com';

// path, priorité, fréquence de changement estimée
const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/le-club', priority: '0.9', changefreq: 'monthly' },
  { path: '/activites', priority: '0.9', changefreq: 'monthly' },
  { path: '/tarifs', priority: '0.8', changefreq: 'monthly' },
  { path: '/reservation', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/actualites', priority: '0.6', changefreq: 'weekly' },
  { path: '/mentions-legales', priority: '0.2', changefreq: 'yearly' },
  { path: '/politique-confidentialite', priority: '0.2', changefreq: 'yearly' },
  { path: '/cookies', priority: '0.2', changefreq: 'yearly' },
];

const lastmod = new Date().toISOString().split('T')[0];

const urls = ROUTES.map(
  (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(out, xml, 'utf8');
console.log(`✓ sitemap.xml généré (${ROUTES.length} URLs) → ${out}`);
