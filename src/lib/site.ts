// The bare domain redirects to www, so www is the canonical host: the sitemap, robots.txt
// and share-image URLs built from this must name it directly instead of going through a redirect.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.estatehub.ph";
