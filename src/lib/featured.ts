import { formatPrice, formatPriceRange, type PropertyGridItem } from "@/sanity/types";

/** One card on the homepage's "Featured properties" row. Render-ready: no Sanity shapes, no price math. */
export interface FeaturedItem {
  kind: "listing" | "development";
  slug: string;
  /** Root-relative detail page */
  href: string;
  title: string;
  location: string;
  tag: "For Sale" | "For Lease" | "Pre-selling";
  priceText: string;
  imageUrl: string | null;
  imageAlt: string;
}

export const FEATURED_COUNT = 4;

// Listing photos are resolved at width 1600 for the detail pages; a homepage
// card is at most about 420 px wide, so ask the Sanity CDN for 800.
const CARD_IMAGE_WIDTH = 800;

export function cardImageUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(CARD_IMAGE_WIDTH));
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * The homepage shows the first `limit` grid items. `getAllPropertyGridItems()`
 * already sorts newest first, so no sorting happens here (one rule, one place).
 */
export function toFeaturedItems(items: PropertyGridItem[], limit = FEATURED_COUNT): FeaturedItem[] {
  return items.slice(0, limit).map((item) => {
    const cover = item.photos[0] ?? null;
    const common = {
      slug: item.slug,
      title: item.title,
      location: item.location,
      imageUrl: cover ? cardImageUrl(cover.url) : null,
      imageAlt: cover?.alt ?? "",
    };
    if (item.kind === "listing") {
      return {
        kind: "listing",
        href: `/properties/${encodeURIComponent(item.slug)}`,
        tag: item.status,
        priceText: formatPrice(item),
        ...common,
      };
    }
    return {
      kind: "development",
      href: `/developments/${encodeURIComponent(item.slug)}`,
      tag: "Pre-selling",
      priceText: formatPriceRange(item.priceFrom, item.priceTo),
      ...common,
    };
  });
}
