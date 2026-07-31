# EstateHub.ph — CMS scoping document

**Decision to make:** which content-management system lets the owner add and edit property listings and broker profiles herself — no developer, no code, no redeploy by hand — and what switching to it actually involves.

**Recommendation up front: Sanity** (free plan), with its editing app hosted on Sanity's own domain — not embedded into estatehub.ph. This keeps the website itself exactly as security-hardened as it is today (no login page, no database, no admin panel on the site), while giving the owner a bookmark-able editing screen where she signs in with her Google account, fills in forms, drags in photos, and clicks Publish. The live site updates itself about two minutes later.

---

## 1. Why anything needs to change

Today, every listing and broker profile is literally TypeScript source code: `src/data/listings.ts` (6 sample properties) and `src/data/brokers.ts` (1 real broker, Rosemarie A. Ramos, migrated from the intake workbook today). Adding a listing currently means editing code, committing to GitHub, and letting Vercel redeploy — developer work, every time. The site was deliberately built this way (static-first, zero admin surface, documented in the security spec), and that was the right call for launch. A CMS is the piece that makes content self-service without giving that up.

## 2. The candidates (exactly three, all real products)

| | **Sanity** (recommended) | **Payload 3** | **Contentful** |
|---|---|---|---|
| What it is | Hosted headless CMS, the strongest Next.js pairing in its class | Open-source CMS that installs *inside* the Next.js app itself (TypeScript-native) | Hosted headless CMS, the big-enterprise incumbent |
| Where the editing UI lives | `estatehub.sanity.studio` — Sanity's domain, not yours | `estatehub.ph/admin` — **on your own site** | `app.contentful.com` — Contentful's domain |
| Cost at this scale (6–20 listings, 1–5 brokers) | **$0.** Free plan: ~20 GB asset storage, 10 GB bandwidth/mo, 500k CDN requests/mo, seats for owner + developer. Next tier is $15/seat/mo | **$0 software** (MIT), but requires a database (Neon Postgres) and file storage (Vercel Blob) — both have free tiers now, both become small paid bills as photos accumulate | **$0** on the free plan (5 users, 25k records). But the next tier is a cliff: **$300/month** |
| Photo uploads | Built in. Drag-and-drop; served from Sanity's image CDN with automatic resizing/cropping — directly solves the "replace Picsum placeholders with real photography" task | Via Vercel Blob adapter; works, but with a 4.5 MB serverless upload cap requiring a client-upload workaround — real-estate photos routinely exceed 4.5 MB | Built in, comparable to Sanity |
| Zero-admin-surface on estatehub.ph | **Preserved.** The public site gains no login, no database, no admin route. Content is fetched only at build time | **Traded away.** Reintroduces a login form, session handling, a database, and an admin panel on the public domain | Preserved (same off-domain model as Sanity) |
| Editing experience | Forms with dropdowns, required-field validation, drag-to-reorder photo galleries; sign in with Google | Also good | Serviceable but the clunkiest of the three at free tier |

**Considered and cut:** git-based CMSs (Tina, Keystatic, Decap) reuse the existing auto-deploy nicely, but store photos inside the git repository — wrong for a photography-heavy real estate site. Strapi and Directus need their own always-running server: oversized for 20 listings.

### Why Sanity, specifically, for this site

1. **It is the only option that is simultaneously free at this scale, off-domain (posture preserved), and strong at images.** Payload fails the posture test; Contentful passes it but has a $300/mo cliff behind it.
2. **It fits the existing architecture instead of replacing it.** The site stays fully static; Sanity is consulted only during Vercel builds. If Sanity ever has an outage, estatehub.ph does not go down — the owner just can't publish an edit until it recovers.
3. **The maintenance burden lands on the developer side, once, at setup.** Afterward the owner's world is: bookmark, Google sign-in, form, Publish.

---

## 3. Migration plan (Sanity), in order

### Step 1 — Create the Sanity project
One free Sanity project, one dataset named `production`, set to **public read** (everything in it is content the website already displays publicly, so this exposes nothing new).

### Step 2 — Define the two content types, mirroring the existing interfaces

**Listing** — the fields already in `src/data/listings.ts`'s `Listing` interface: `title`, `slug` (auto-generated), `status` (dropdown: For Sale / For Lease), `type` (dropdown: House / Condo / Townhouse / Lot / Commercial), `location`, `price`, `beds`/`baths`/`floorAreaSqm`/`lotAreaSqm` (optional numbers), `blurb`, `neighborhood`. Locking the dropdowns matters — `PropertiesResults.tsx` allowlist-validates URL filters against those same unions.

Two deliberate improvements, not inventions:
- `photoIds` (Picsum IDs) becomes `photos`: uploaded images with a **required alt-text field** — closes the "placeholder alt text pending real photography" gap.
- `brokerId` becomes a **reference field** — pick the broker from a dropdown instead of typing an ID, removing a silent-typo risk.

**Broker** — the fields already in `src/data/brokers.ts`: `name`, `prcLicense`, `phone`, `email`, `areas`, `languages`, `bio`, and **keep `isSample`** (default false) — so any future stand-in entry still gets labeled, matching `AgentBlock.tsx`'s existing warning.

### Step 3 — Deploy the Studio off-domain
The editing app deploys to `estatehub.sanity.studio` — **not** mounted inside estatehub.ph, even though Sanity supports that. This is the choice that preserves the zero-admin-surface decision. The owner gets a URL to bookmark, Google sign-in, and a 15-minute walkthrough.

### Step 4 — Content: real broker in, fake listings **not** seeded
- The 1 real broker gets entered manually (doubles as the owner's training run).
- **The 6 sample listings do not get seeded into the CMS.** They're labeled fakes — the CMS should be true by construction. Seeding fakes recreates today's problem inside the new system.
- The owner enters her first real listings into the Studio *before* the code switches over — the site keeps rendering samples from the old files until the cutover deploy swaps them in one move. No empty-site window.

### Step 5 — Rewire the code (the named files)
New: `src/sanity/client.ts` + `src/sanity/queries.ts` — typed fetch functions returning the same shapes the components already use.

Changed (~12 files): `FeaturedProperties.tsx` (fetch instead of import), `properties/page.tsx` (fetches, passes to `PropertiesResults.tsx` — whose client-side filter logic stays unchanged), `properties/[slug]/page.tsx` (`generateStaticParams` fetches slugs; broker comes dereferenced in the same query), `PropertyCard.tsx` + `Gallery.tsx` (Sanity CDN image URLs + real alt text), `about/page.tsx` (roster fetched), `AgentBlock.tsx` (import path only), `next.config.ts` (`cdn.sanity.io` added, picsum entries removed at cutover). Deleted at cutover: `listings.ts`, `brokers.ts`.

### Step 6 — How publishing reaches the live site: rebuild-on-publish, not ISR
A Sanity webhook fires on publish and calls a **Vercel Deploy Hook**, triggering a normal full rebuild — live in about two minutes. This keeps the architecture byte-for-byte what it is today: everything still fully prerendered, no new dynamic route, no revalidation secret. At brokerage cadence (a few edits a week), two-minute latency costs nothing, and "Publish, wait two minutes, refresh" is the simplest possible mental model for a non-technical owner.

**Verification gate:** after the flip, `npm run build`'s route table must show the same shape as today — everything static except `/api/inquiry`.

### Step 7 — Environment variables
`NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` — both public identifiers, not secrets. With a public-read dataset, the website needs zero new secrets.

---

## 4. Honest effort framing

**Several focused working sessions, not an afternoon** — comparable in weight to one of the original six build stages. Divides into: Sanity setup + schema + Studio deploy; rewiring ~12 files + the query layer; the image layer; content entry (owner's time, developer on the call); webhook/env config + re-verifying the touched pages.

**What does NOT change:** the design system and visual/taste work, header/nav/search, service pages (`services.ts` stays in code — it's the listings/brokers that churn, not page copy), the contact form and its spam protections, the noindex/robots setup (lifting it is a separate decision, though this migration is what makes real content exist to lift it *for*), and everything done today on Vercel/domain/DNS.

## 5. The zero-admin-surface question, answered directly

**Preserved intact.** After migration, the public site still has no login, no session handling, no database, no admin route, and exactly one dynamic endpoint (`/api/inquiry`, unchanged). The site doesn't even talk to Sanity at runtime — only Vercel's build process does — so a CMS outage can never take the site down, only pause publishing.

What's honestly new: an admin surface now *exists* — at `estatehub.sanity.studio`, behind Sanity's own authentication. The real new risk is account-level, not site-level: whoever can sign into the Studio can change what the site says. Mitigations: exactly two seats (owner + developer), Google sign-in backed by 2FA, Sanity's edit history for rollbacks. Standing rule: nothing non-public ever goes into this dataset, since it's world-readable by design.

Choosing Payload instead would reintroduce the login form, database, and admin panel onto estatehub.ph itself — the exact surface the security spec was written to exclude. That's the single biggest reason it's the runner-up.

## 6. Running costs and the decision

CMS: **$0/month** at this scale. One adjacent flag, independent of the CMS choice: **a commercial brokerage site should be on Vercel's Pro plan ($20/mo), not the non-commercial Hobby tier** — worth confirming which one today's deployment landed on.

**The decision being asked:** yes/no to Sanity as scoped above.
