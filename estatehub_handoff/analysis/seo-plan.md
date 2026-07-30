# EstateHub.ph — SEO Audit &amp; Plan

**Status:** Retrospective audit of the built site (pre-deployment) plus a forward plan. Everything in "already solid" was verified against the codebase as it exists; everything in "gaps" was verified *absent* by grep, not assumed. Domain placeholder throughout is `https://estatehub.ph` — **the real production domain is an open deployment-conversation item** (registrar is GoDaddy; hosting undecided) and must be substituted in exactly one place (see §3.0) once known.

---

## 1. Scorecard — the site's own SEO checklist

| Checklist item | Status | Notes |
|---|---|---|
| Page titles | **Done** | All 12 metadata-bearing files export a title; root layout sets `%s | EstateHub.ph` template + keyworded default |
| Meta descriptions | **Done** | Per-page, including data-driven ones (`service.metaDescription`, `listing.blurb`) |
| Heading structure | **Done** | Exactly one `<h1>` per page, verified by grep, zero exceptions; one minor duplication (§2.2) |
| Semantic HTML | **Done** | `nav`/`main`/`header`/`footer`/`section`, skip link, `aria-current`, labeled breadcrumb navs |
| Internal linking | **Done** | Footer nav, breadcrumbs on `/properties/[slug]` + `/services/*`, service ↔ `/overseas` cross-links |
| URL structure | **Done** | Clean, human-readable, no query-string page identity (§2.3) |
| Image alt text | **Done (placeholder-appropriate)** | Position-based alt pending real photography — correct call (§2.4) |
| Site speed | **Fast by architecture, unmeasured** | 22/23 routes static, `next/image` + `next/font`; no Lighthouse/CWV pass yet (§2.5, §6) |
| OpenGraph / Twitter tags | **Missing** | No `openGraph` key anywhere → fix in §3.2 |
| `metadataBase` | **Missing** | Required before OG images can resolve absolute URLs → §3.1 |
| `sitemap.xml` | **Missing** | No `src/app/sitemap.ts` → §3.3 |
| `robots.txt` | **Missing** | No `src/app/robots.ts` → §3.4 |
| Structured data (JSON-LD) | **Missing** | No Organization/RealEstateAgent/Breadcrumb schema anywhere → §3.5 |

The done column is genuinely done — the misses are all in the "site-level plumbing" layer (social/crawler metadata), which is also the layer that's cheap to fix and mostly independent of the sample-content caveat.

---

## 2. What's already solid, and why it matters *here*

### 2.1 Titles and descriptions

Every substantive page has its own `export const metadata` / `generateMetadata()`, and — more importantly — the content of them is already doing keyword work, not just existing:

- Root default: `"EstateHub.ph | Full-Service Real Estate Brokerage in the Philippines"` — carries the two entity terms that matter ("real estate brokerage" + "Philippines") on the one page most likely to rank for the brand.
- Service descriptions (in `src/data/services.ts`) already read like the queries they should answer, e.g. sales: *"Buy or sell property in the Philippines with a licensed broker handling valuation, marketing, negotiation, and closing."* and property management: *"Property management in the Philippines for local and overseas owners…"*. These match brokerage-intent searches ("licensed real estate broker philippines", "property management philippines") — which is the query class a curated brokerage can actually win, unlike portal head terms (§4.3).
- Listing pages get `listing.title` + `listing.blurb` via `generateMetadata()` in `src/app/properties/[slug]/page.tsx`, so titles like `3BR Villa, Tagaytay Ridge | EstateHub.ph` already encode bed count + type + location — the exact anatomy of PH property queries (§4.1).

Why it matters for this brand specifically: for a trust-first, bank-like brokerage, the SERP snippet is the first trust impression — a clean, specific title/description pair *is* brand expression, and "licensed broker" language in snippets differentiates from portal results before the click.

### 2.2 Heading structure

One `<h1>` per page, verified. Two honest observations, neither urgent:

1. **The H1s are brand-voice, not keyword-bearing** — "We sell it for you.", "Buying from abroad, handled.", "Building generational wealth, one move at a time." This is a *deliberate, acceptable trade*: the EB Garamond editorial headline system is a core premium signal (per the UI design system), and the keyword weight is carried by titles/descriptions/body copy instead. **Do not keyword-stuff the serif H1s.** The one thin spot is `/properties`, whose H1 is just "Properties" — extending it to something like "Properties for sale and lease" (mirroring its own meta title) would add query language without breaking voice. Owner's call; copy-level change only.
2. **`/` and `/about` share the identical H1** ("Building generational wealth, one move at a time." — `src/components/home/Hero.tsx` and `src/app/about/page.tsx`). Not a penalty, and the title tags differ, but two pages competing with the same headline is mildly wasteful. If `/about` ever gets a copy pass, give it its own line.

### 2.3 URL structure

`/properties/3br-villa-tagaytay-ridge`, `/services/sales`, `/overseas` — flat, readable, keyword-carrying, no query-string identity. Two specifics worth naming:

- Listing slugs encode **type + location** (`2br-rental-cebu-it-park`, `commercial-lot-batangas`) — matching how Filipinos search (§4.1) — while deliberately *omitting transaction status*. That omission is actually correct: a property's status can flip (sold, re-listed for lease), and `for-sale` baked into a URL becomes a lie or a redirect later. Portals like Lamudi segment `/buy/` vs `/rent/` because they operate at tens of thousands of listings; at curated-brokerage scale, status-free slugs are the more durable design. **Keep this convention when real inventory lands, and treat slugs as permanent** — once a listing URL is live and indexed, changing it means a 301, not an edit.
- `/properties` filtering is client-side state on a single static route — there are no crawlable filtered URLs. At 6 listings this is correct. The eventual search-capture answer is *dedicated static location/type pages*, not indexable filter permutations (§4.3, phase 2).

### 2.4 Alt text, semantic HTML, internal linking

- The placeholder alt-text policy ("3BR Villa, Tagaytay Ridge, photo 2 of 3" — position, not fabricated description) is the right call and, incidentally, still carries the listing name + location as image-SEO signal. When real photography lands, swap to genuine descriptions (*"Living room opening onto the garden deck, 3BR villa in Tagaytay Ridge"*) — describe the photo, don't stack keywords.
- Semantic landmarks, `lang="en"` (correct — PH property search is overwhelmingly English-keyword; no hreflang needed for a single locale), `aria-current="page"`, and labeled breadcrumb `<nav>`s all double as crawler signals. The accessibility work already done *is* SEO work.
- Internal linking is real, not decorative: breadcrumbs on listing and service pages, service ↔ `/overseas` cross-links, footer nav. Listing-card anchor text is the listing title (type + location) — good anchors for free.

### 2.5 Speed

22 of 23 routes fully static (confirmed by `npm run build`), `next/image` for all photos, `next/font` with swap. For PH traffic — heavily mobile, often mid-range Android on variable mobile data — static HTML + optimized images is the single highest-leverage speed decision, and it's already made. What has *not* happened is any measurement (no Lighthouse run, no CWV data) — that's flagged honestly in §6, and a local Lighthouse pass is in the punch list because it's doable *now*, pre-deploy.

---

## 3. The gaps — concrete fixes

### 3.0 First: one site-URL constant

Everything below needs an absolute origin. Create it once so the real domain is a one-line change at deploy time:

```ts
// src/lib/site.ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://estatehub.ph"; // TODO: confirm production domain at deploy
```

The env-var override also handles staging/preview URLs cleanly.

### 3.1 `metadataBase`

One line in `src/app/layout.tsx`'s existing metadata export:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { /* unchanged */ },
  description: /* unchanged */,
};
```

Without this, Next.js cannot resolve relative OG image paths to the absolute URLs that Facebook/Messenger scrapers require — it's a prerequisite for §3.2, not an optional nicety.

### 3.2 OpenGraph + Twitter tags

**Why this is disproportionately important for this site:** Messenger is the co-primary contact channel (per the user journeys — especially renters and overseas buyers), and Facebook dominates PH social traffic. Listing URLs *will* be pasted into Messenger threads and Facebook posts constantly — an OFW forwarding a listing to family back home is a core journey. Without OG tags, those shares render as a bare link. With them, every share is a property card. This is the single highest-value missing item.

Three parts:

**a) A default OG image (site-wide).** Use Next's file convention: drop a 1200×630 brand card at `src/app/opengraph-image.png` (plus `src/app/opengraph-image.alt.txt`). Every route inherits it automatically. Build the card from the logo kit — navy tile, Hub Frame mark, ESTATEHUB.PH wordmark, flat color only per `logo-kit/README.md` (no gradients/shadows). This asset doesn't exist yet and is a real (small) design task.

**b) Shared defaults in the root layout:**

```ts
openGraph: {
  siteName: "EstateHub.ph",
  type: "website",
  locale: "en_PH",
},
twitter: { card: "summary_large_image" },
```

**c) Per-page `openGraph.title`/`description` — via a helper, because of a Next.js merge gotcha:** metadata merges shallowly per top-level key, and the `%s | EstateHub.ph` title template does **not** apply to `openGraph.title`. A page that sets only `title` will emit the *layout's* OG title. Rather than hand-writing `openGraph` in 12 files, add a helper and route the existing exports through it:

```ts
// src/lib/seo.ts
import type { Metadata } from "next";

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title: `${title} | EstateHub.ph`, description },
  };
}
```

Pages become one-liners (`export const metadata = pageMetadata("Contact Us", "…")`); the four service pages and `generateMetadata()` in `/properties/[slug]` feed their existing data-driven strings through the same function. **Per-listing OG *images* (the cover photo as the share card) are blocked on real photography** — putting Picsum stock in share cards would be worse than the brand default. Wire it up when photos land: `openGraph.images: [listing cover]` inside `generateMetadata()`.

### 3.3 `sitemap.ts`

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { LISTINGS } from "@/data/listings";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/properties",
  "/services/sales",
  "/services/lease",
  "/services/property-management",
  "/services/business-solutions",
  "/overseas",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...LISTINGS.map((l) => ({ url: `${SITE_URL}/properties/${l.slug}` })),
  ];
}
```

Design notes:

- It imports the **same `LISTINGS` array that `generateStaticParams()` already uses** in `src/app/properties/[slug]/page.tsx` — so when the intake workbook replaces the 6 sample listings with real inventory, the sitemap updates itself with zero extra work. That's the whole reason to derive it from data rather than hand-listing URLs.
- Excluded: `/api/inquiry` (not a page), 404.
- `lastModified` is omitted deliberately: `Listing` has no date field, and a fabricated timestamp is noise. When the intake workbook lands, add a `listedAt`/`updatedAt` column and thread it through. Skip `priority`/`changeFrequency` — Google ignores them.

### 3.4 `robots.ts`

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

Two related deployment cautions:

- **Do not let sample listings get indexed.** The project's own rule is "no fabricated content," and six sample properties in Google's index would violate its spirit. If the site goes to a public URL *before* real inventory lands, that deployment must be noindexed (Vercel noindexes preview deployments automatically; any other host/staging setup needs this verified explicitly). The clean sequencing: real inventory in, *then* indexable production deploy.
- `disallow: "/api/"` is crawl hygiene, not security — the inquiry route's real protections (honeypot, rate limiting, validation) already live in `src/app/api/inquiry/route.ts`.

### 3.5 Structured data (JSON-LD)

Three tiers, in honesty order:

**a) `RealEstateAgent` (Organization) — do now, with intake-blocked fields marked.** `RealEstateAgent` is schema.org's LocalBusiness subtype for exactly this business model; it tells Google "this is a brokerage entity," which supports brand-query results and local-business features. Render it once in the root layout:

```tsx
// in src/app/layout.tsx (body)
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "EstateHub.ph",
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image.png`,
  description: "Full-service real estate brokerage in the Philippines...",
  areaServed: { "@type": "Country", name: "Philippines" },
  // BLOCKED ON INTAKE (Channels tab): telephone, email
  // BLOCKED ON INTAKE: address (PostalAddress) — /overseas promises "Real company, real address"; schema must match it
  // BLOCKED ON MESSENGER SETUP: sameAs: [facebook page URL]
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema).replace(/</g, "\\u003c") }}
/>
```

(The `replace` is standard XSS hygiene for JSON-LD; the data here is first-party, but it costs nothing.) Ship the known fields now; the address/phone/sameAs slots are already tracked by the launch-content-intake workbook and Messenger-page-ID task.

**b) `BreadcrumbList` — cheap, verifiable win.** Breadcrumbs are one of the few structured-data types with a visible Google rich result (the path trail replacing the raw URL in SERPs), and the site *already renders visual breadcrumbs* on `/properties/[slug]` and `/services/*` (added during Stage 5 QA). Mirror them in JSON-LD on those same pages (Home → Properties → listing title; Home → Services → service name). This is pure translation of existing UI into markup — no content dependency.

**c) `RealEstateListing` per property — defer, deliberately.** Two reasons, stated plainly:

1. **Google has no rich result for real estate listings.** Unlike products or job postings, marking up a listing doesn't earn visual SERP treatment — the payoff is marginal machine-readability, not clicks.
2. **The current 6 listings are labeled sample data.** Publishing schema that asserts a ₱24.8M Tagaytay villa as a machine-readable real-world offer is *worse* than the honest UI labels — structured data strips the "sample" context.

When real inventory lands, the cost of adding it is low (the `Listing` interface in `src/data/listings.ts` already has every field a `RealEstateListing` + `Offer` block wants: price, address/location, beds, baths, floor/lot sqm) — so revisit it then as a nice-to-have, behind the higher-value per-listing OG images.

---

## 4. PH real-estate search behavior vs. this site

No invented search volumes here — this is reasoned from how the niche's queries are structured and from the project's own competitive research (Lamudi, Hoppler, OnePropertee, Dot Property, et al.).

### 4.1 Query anatomy

PH property searches follow a stable pattern: **{property type} + {"for sale" | "for rent"} + {location}** — "condo for sale bgc", "house and lot for sale tagaytay", "apartment for rent cebu it park", "office space for rent makati", "lot for sale batangas". Three vocabulary specifics:

- **"House and lot"** is the distinctly Filipino phrase for what the data model calls `House` — it should appear in listing copy and any future location-page copy, even if the type enum stays as-is internally.
- **"For rent" beats "for lease"** in residential search language; "for lease" reads commercial. The site's status enum is `"For Sale" | "For Lease"` (`src/data/listings.ts`). Fine as a UI label system, but residential rental listings should carry "for rent" in their *title/blurb copy* when real inventory lands — "2BR Rental, Cebu IT Park" is close; "2BR condo for rent, Cebu IT Park" is the query. This is a content-intake guideline, not a refactor.
- Location granularity matters: Filipinos search at the district/landmark level (BGC, Alabang, Cebu IT Park, Tagaytay Ridge, Makati CBD) — exactly the granularity the current slugs and titles already use. Good.

### 4.2 What the current structure already serves

Listing URLs/titles encode type + count + location (§2.3); each listing carries a unique `neighborhood` paragraph (real per-location copy, e.g. the Tagaytay Ridge/CALAX and BGC-walkability blurbs) — that's genuine location content most small brokerage sites skip. Service-page meta descriptions target brokerage-intent queries. `/overseas` targets a query space almost nobody serves well (per the research, only Dot Property tries).

### 4.3 The honest competitive frame

EstateHub will **not** out-rank Lamudi/OnePropertee on head terms like "condo for sale manila" — portals win those with tens of thousands of indexed listing pages and years of accumulated authority. The realistic search strategy for a curated brokerage is:

1. **Brokerage-intent queries** ("licensed real estate broker philippines", "property management for OFW", "sell my house broker manila") — service pages already aim here; this is Hoppler's lane, and the site is positioned to compete in it.
2. **Long-tail informational, especially `/overseas`** — "how to buy property in the philippines while abroad", "special power of attorney to buy property philippines", "OFW buying house and lot". `/overseas` is the one page whose content mandate (remote process explainer, POA guidance, timezone contact) is *inherently* long-tail SEO content. Consider whether the literal term "OFW" earns a place in its title/copy — it's the vocabulary the audience actually searches, and the current title ("Buying and Owning Property from Abroad") doesn't contain it. Don't bother chasing FAQ rich results — Google restricted those to government/health sites in 2023.
3. **Per-listing long-tail** — a specific real property with a well-titled page can rank for its own hyper-specific query ("3br house for sale alabang [village name]") because portals' pages for the same property are template-thin. This only activates with real inventory.
4. **Phase-2 location/type landing pages** — "Condos for sale in BGC"-style static pages are how portals capture location queries; for EstateHub these belong with the already-planned `/guides` neighborhood guides (phase 2, unlinked at launch per the sitemap spec). Don't build them before there's real inventory to populate them.

Also worth one line: a **Google Business Profile** (off-site, post-deploy, needs the real office address) will do more for "real estate broker + {city}" local queries than any on-page markup — it pairs with the `RealEstateAgent` schema in §3.5.

---

## 5. Prioritized punch list

### Now — pre-deploy, content-independent (all code, ~half a day total)

1. `src/lib/site.ts` with `SITE_URL` placeholder + env override (§3.0)
2. `metadataBase` in root layout (§3.1)
3. `src/app/robots.ts` (§3.4)
4. `src/app/sitemap.ts` deriving listing URLs from `LISTINGS` (§3.3)
5. Brand OG card: design 1200×630 from logo kit → `src/app/opengraph-image.png` + alt file (§3.2a)
6. Root-layout `openGraph` defaults + `twitter.card` (§3.2b)
7. `pageMetadata()` helper; thread the 12 existing metadata exports through it (§3.2c)
8. `RealEstateAgent` JSON-LD in layout with intake-blocked fields commented (§3.5a)
9. `BreadcrumbList` JSON-LD on `/properties/[slug]` and `/services/*`, mirroring existing visual breadcrumbs (§3.5b)
10. Validate JSON-LD via schema.org validator / Rich Results Test code-paste mode (works pre-deploy)
11. Run Lighthouse locally against the production build (`npm run build && npm start`) — first actual speed measurement; record baseline scores and first-load JS from the build output

### At deploy

12. Set the real domain in `SITE_URL` (or `NEXT_PUBLIC_SITE_URL`) — one place, on purpose
13. Confirm sequencing: **no indexable public deploy while listings are sample data** (verify staging/preview noindex behavior on whatever host is chosen) (§3.4)
14. Google Search Console: verify property, submit `/sitemap.xml`, confirm coverage
15. Facebook Sharing Debugger on `/`, one service page, one listing — needs a live URL (§6)

### Blocked on real content (intake workbook + photography) — do not do early

16. Per-listing OG images from real cover photos in `generateMetadata()` (§3.2c)
17. Real descriptive alt text replacing position placeholders (§2.4)
18. Apply copy vocabulary to real inventory: "for rent" for residential rentals, "house and lot", district-level location names in titles/blurbs (§4.1) — and hold the slug convention (type + location, no status, permanent once published) (§2.3)
19. Complete `RealEstateAgent` schema: address, telephone, `sameAs` Facebook URL (§3.5a)
20. `listedAt`/`updatedAt` field → sitemap `lastModified` (§3.3)
21. Decide on `RealEstateListing` per-property schema — optional even then (§3.5c)
22. Google Business Profile with the real office address (§4.3)

### Phase 2 / later

23. Location/type landing pages alongside `/guides` neighborhood guides (§4.3)
24. `/overseas` content depth for POA/remote-purchase long-tail; revisit "OFW" in title/copy (§4.3)
25. `/properties` H1 copy extension; distinct `/about` H1 (§2.2) — owner's call, tone-gated
26. Field CWV monitoring once real traffic exists (§6)

---

## 6. What cannot be verified without a live deployment

Flagged so nothing here gets claimed as "done" prematurely:

- **Field Core Web Vitals** — CrUX data requires a public URL *and* real Chrome traffic over ~28 days. Local Lighthouse (punch list #11) gives lab numbers now; it is not the same thing and shouldn't be reported as if it were.
- **Actual crawl and indexation behavior** — how Googlebot handles the site, coverage errors, discovered-vs-indexed gaps: Search Console only, post-deploy.
- **SERP rendering** — Google rewrites titles/descriptions at its discretion; whether the carefully written snippets survive is only observable in live results.
- **Social share rendering** — Facebook's Sharing Debugger and Messenger's link scraper need a publicly reachable URL; OG markup can be code-reviewed now but not seen rendered. Given Messenger's centrality here, budget a real check at deploy (#15).
- **Search demand specifics** — this plan reasons from query *structure*, not measured volumes; once Search Console has data, actual PH query strings should recalibrate §4 (particularly the "for rent" vs "for lease" and "OFW" vocabulary calls).
- **Real-device speed** — same caveat the responsive spec already carries: browser emulation isn't a mid-range Android on mobile data. CWV field data (above) is the eventual truth source.

---

**Bottom line:** the on-page fundamentals this checklist cares about are genuinely in place and well-suited to how Filipinos search for property; the gaps are concentrated in crawler/social plumbing (`metadataBase`, OG, sitemap, robots, JSON-LD) that is content-independent, cheap, and should be closed now — while per-listing SEO polish (share images, alt text, schema, copy vocabulary) is correctly blocked behind real inventory and photography, and forcing it early would mean optimizing content that's contractually going to be replaced.
