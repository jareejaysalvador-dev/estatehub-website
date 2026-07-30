import type { MetadataRoute } from "next";

// PRE-LAUNCH: disallow all crawling while listings/broker roster are sample
// data (see estatehub_handoff/analysis/seo-plan.md, punch-list item 13).
// Works alongside the site-wide noindex in src/app/layout.tsx's metadata -
// this asks crawlers not to visit at all; that meta tag stops indexing even
// if a page gets linked to from elsewhere. Replace with the permissive
// version from the SEO plan (allow "/", disallow "/api/", real sitemap
// reference) once real inventory replaces the sample listings.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
