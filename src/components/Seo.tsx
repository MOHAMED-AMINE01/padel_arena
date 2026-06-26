import React from 'react';
import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  absoluteUrl,
  toAbsoluteImage,
  breadcrumbJsonLd,
  type Breadcrumb,
} from '../lib/seo';

interface SeoProps {
  /** Titre de la page (le nom du club est ajouté automatiquement). */
  title: string;
  /** Méta-description (≈ 150-160 caractères). */
  description?: string;
  /** Chemin canonique de la page, ex. "/le-club". */
  path: string;
  /** Image de partage (relative ou absolue). */
  image?: string;
  /** Type Open Graph. */
  type?: 'website' | 'article';
  /** Empêche l'indexation (espaces privés, pages utilitaires). */
  noindex?: boolean;
  /** Ne pas suffixer le nom du club (pour la home). */
  rawTitle?: boolean;
  /** Fil d'Ariane → BreadcrumbList. */
  breadcrumbs?: Breadcrumb[];
  /** Données structurées additionnelles (objet ou tableau). */
  jsonLd?: object | object[];
}

/**
 * Gère les métadonnées par page via le hoisting natif de React 19 :
 * <title>, <meta>, <link rel="canonical"> sont automatiquement remontés
 * dans <head>. Les blocs JSON-LD sont rendus en place (lus par Google
 * où qu'ils soient dans le document).
 */
export const Seo: React.FC<SeoProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  type = 'website',
  noindex = false,
  rawTitle = false,
  breadcrumbs,
  jsonLd,
}) => {
  const fullTitle = rawTitle ? title : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const img = toAbsoluteImage(image);
  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const graphs: object[] = [];
  if (breadcrumbs && breadcrumbs.length > 0) graphs.push(breadcrumbJsonLd(breadcrumbs));
  if (jsonLd) graphs.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {/* Données structurées */}
      {graphs.map((g, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(g) }}
        />
      ))}
    </>
  );
};

export default Seo;
