/**
 * Constantes et constructeurs de données structurées (SEO) du site.
 * Centralise tout ce qui touche au référencement pour rester cohérent.
 */

export const SITE_URL = 'https://padelarenavendome.com';
export const SITE_NAME = 'Padel Arena Vendôme';
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const DEFAULT_DESCRIPTION =
  "Réservez votre terrain de padel à Vendôme 24h/24. Padel Arena Vendôme : pistes de padel premium couvertes, badminton, simulateur de golf et club house au cœur du Loir-et-Cher (41100).";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/IMAGES/og-image.png`;

/** Construit une URL absolue à partir d'un chemin relatif. */
export const absoluteUrl = (path = '/'): string =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** Garantit une URL d'image absolue (les crawlers sociaux exigent l'absolu). */
export const toAbsoluteImage = (src?: string): string => {
  if (!src) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(src)) return src;
  return absoluteUrl(src);
};

export interface Breadcrumb {
  name: string;
  path: string;
}

/** Fil d'Ariane structuré (BreadcrumbList). */
export const breadcrumbJsonLd = (crumbs: Breadcrumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

/** WebPage rattachée au site et à l'organisation. */
export const webPageJsonLd = (opts: {
  path: string;
  name: string;
  description: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${absoluteUrl(opts.path)}#webpage`,
  url: absoluteUrl(opts.path),
  name: opts.name,
  description: opts.description,
  inLanguage: 'fr-FR',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
});

/** FAQPage (rich result « questions/réponses » dans Google). */
export const faqJsonLd = (items: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((it) => ({
    '@type': 'Question',
    name: it.question,
    acceptedAnswer: { '@type': 'Answer', text: it.answer },
  })),
});
