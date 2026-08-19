import type { Metadata } from "next";

const SITE_NAME = "EstateHub.ph";

export interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

// A page that sets its own openGraph object (every pageMetadata() caller
// does) doesn't inherit the root layout's file-convention opengraph-image.png
// the way a page with no metadata override would - Next treats an explicit
// openGraph object as complete, images or not. Falling back to this default
// image explicitly, rather than omitting `images`, keeps every page's share
// card populated even when a listing/development has no photo yet.
const DEFAULT_IMAGE: OgImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "EstateHub.ph — Full-Service Real Estate Brokerage in the Philippines",
};

/**
 * Wraps a page's title/description into full OpenGraph + Twitter metadata.
 * Two Next.js quirks this exists to route around: `openGraph.title` doesn't
 * get the root layout's `%s | EstateHub.ph` title template the way plain
 * `title` does, and a page that sets its own `openGraph`/`twitter` object
 * replaces the parent's wholesale rather than merging key-by-key - so
 * siteName/type/locale are repeated on every call instead of set once in
 * the layout and assumed to survive.
 */
export function pageMetadata(title: string, description: string, images?: OgImage[]): Metadata {
  const ogTitle = `${title} | ${SITE_NAME}`;
  const resolvedImages = images ?? [DEFAULT_IMAGE];
  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_PH",
      images: resolvedImages,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: resolvedImages.map(({ url, alt }) => ({ url, alt })),
    },
  };
}

/**
 * Crops a resolved Sanity photo into a 1200x630 share-card image. Strips
 * any existing transform params off the photo's already-resolved display
 * URL first, since Sanity's CDN reads whatever query string is on the
 * request - reusing a display-sized URL's params as-is would fight these.
 */
export function ogImageFromPhoto(
  photo: { url: string; alt: string } | undefined,
  fallbackAlt: string,
): OgImage[] | undefined {
  if (!photo) return undefined;
  return [
    {
      url: `${photo.url.split("?")[0]}?w=1200&h=630&fit=crop&auto=format`,
      width: 1200,
      height: 630,
      alt: photo.alt || fallbackAlt,
    },
  ];
}
