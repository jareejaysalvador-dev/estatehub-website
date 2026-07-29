# PH Real Estate Competitive Research — Full Synthesis

*Sources: `estatehub_handoff/research/PH_Real_Estate_Competitive_Landscape.xlsx` (business/audience/traffic data) and `estatehub_handoff/design-audit/PH_Real_Estate_Design_Audit.docx` (live visual audit with screenshots), both compiled July 2026 for 8 sites: Lamudi Philippines, Dot Property Philippines, OnePropertee, Homes & Land Philippines, Hoppler, MyProperty.ph, RentPad, and Real.ph.*

*Caveats worth keeping in view: traffic/rank figures are directional (Similarweb/Semrush free-tier snapshots), not verified totals. The design audit's screenshots are desktop-only (~1280px) — mobile/responsive behavior was explicitly not tested, despite Philippine web traffic skewing heavily mobile. Homes & Land is both a subject of the research and a source (it publishes self-interested "best site" comparisons).*

## Positioning, before the 8 categories

The eight sites split into two different businesses wearing similar homepages:

- **Self-serve listings portals** — Lamudi, MyProperty.ph, Dot Property, OnePropertee, RentPad, Real.ph. Free or freemium listings, ads/lead-packages monetize agents and developers, the site itself doesn't broker the deal.
- **Full-service brokerage** — Hoppler only. Commission-based, in-house licensed brokers handle the whole transaction, the website is a lead-gen front end for a brokerage, not a marketplace.

EstateHub's own brief — "one point of contact," licensed, "Trusted. Secure. Committed.," established/bank-like tone — reads much closer to **Hoppler's** model than to a raw listings portal. **Confirmed with the user: EstateHub is a full-service brokerage.** Every "for EstateHub" recommendation below should be read through that lens, not the self-serve-portal one.

---

## 1. Layout

| Site | Layout |
|---|---|
| `Lamudi` | Classic portal: full-width hero photo + dark search panel overlay, "Top Partners" developer-logo strip, featured/pre-selling card grids, testimonials, an extensive multi-column SEO footer |
| `Dot Property` | A **paid ad banner sits above the nav**, before any navigation; hero search, then a second promo bar and another ad banner before real listing content appears |
| `OnePropertee` | Editorial/lifestyle: full-bleed furniture photo behind the hero search, then a segmented "For Buyers" / "For Sellers" two-column journey with real people photography and numbered steps |
| `Homes & Land` | Full-bleed aerial photo, centered text, one CTA — **no search bar visible above the fold at all** |
| `Hoppler` | Split-screen: left third is a white card (headline + search), right two-thirds is a large photo of a real Filipino family — reads like a consumer app, not a listings portal |
| `MyProperty.ph` | Near-identical template to Lamudi, simply re-skinned in green |
| `RentPad` | Search-first minimalism: a compact search bar is embedded directly in the nav bar itself |
| `Real.ph` | SaaS-like: full-width upscale villa/pool photography, integrated filter-bar search card sitting in the hero |

**Pattern:** the strongest layouts (Hoppler, Real.ph, RentPad) treat search as the hero's job and put it there without competing clutter. The weakest (Dot Property, Homes & Land) either bury search under promotional content or omit it above the fold entirely.

**For EstateHub:** Hoppler's split-hero (real photo + a focused card) is the closest layout precedent for a full-service-brokerage positioning, and is the strongest single reference point if EstateHub wants to read as more premium/consumer-app than raw-portal. A full-bleed photo hero (Real.ph/Dot Property's pattern) is a legitimate alternative if the brand wants photography to dominate more. Either is fine — what matters is not repeating Dot Property's stacked-promo clutter or Homes & Land's missing-search mistake.

---

## 2. Navigation

| Site | Nav |
|---|---|
| `Lamudi` | 6 items (Buy, Rent, New Developments, Foreclosures, Resources, Home loans), single row, easy to scan |
| `Dot Property` | **9 items** + a currency selector + notification-badged favourites — the busiest nav of the eight |
| `OnePropertee` | 5 lean primary items, but 6 *more* competing items in a top-right cluster (badge, post listing, "Let's Close Deals," pricing, log in, register) |
| `Homes & Land` | Home, Properties, Add Property, More, Connect, an app badge, a phone number, an account icon, "Create a Listing" — all floating on a transparent bar over a photo |
| `Hoppler` | 7 items kept manageable via dropdowns (Buy/Rent each expand); "My Viewing List" is a distinctive saved-items feature surfaced directly in the nav |
| `MyProperty.ph` | 4 items — narrower than parent Lamudi |
| `RentPad` | Leanest of all eight: just Log in, Support, Post for free |
| `Real.ph` | 5 clean items; "List a Property" is a plain text link, not a button, next to Sign In |

**Pattern:** nav item count alone doesn't determine clarity — it's whether *secondary* actions get their own top-level slots. Dot Property and OnePropertee both fail this: not because of the primary nav item count, but because 6-9 *additional* competing items crowd the same header.

**For EstateHub:** the current 4 services (Lease, Property Management, Sales, Business Solutions) sit comfortably under the 5–6 item cap this research repeatedly validates, with room for one or two more before it becomes a problem. The concrete, specific gap: **RentPad's nav-embedded, persistent search bar is called "arguably the single best interaction-design pattern found across all eight audits."** Search confined only to the hero (which is what exists today) is a weaker pattern than search reachable from anywhere on the site without scrolling back up.

---

## 3. CTA placement

| Site | CTA hierarchy |
|---|---|
| `Lamudi` | Two-tier: orange hero "Search" is clearly primary; blue-outline "Publish" (for agents) is visually secondary, top-right |
| `Dot Property` | Hero "Search" competes with a "Get started" seller CTA immediately below, then ad-unit CTAs ("View Properties," "Explore Now") — **the most competing CTAs above the fold of any site reviewed** |
| `OnePropertee` | Contextual green CTAs scoped per section (good practice) but diluted by the 6-item top-right cluster |
| `Homes & Land` | "Create a Listing" appears twice, targeting sellers only — **buyers have no visible way to search until they scroll**, the single largest conversion gap found |
| `Hoppler` | One outlined "Post Property For Free" isolated top-right against the primary hero search — **the cleanest CTA hierarchy of the eight sites audited** |
| `MyProperty.ph` | Same two-tier pattern as Lamudi |
| `RentPad` | Primary search, plus an isolated amber "Help me find a place" — a concierge/assisted-search alternative next to self-serve search |
| `Real.ph` | One filled teal "Search" button; "List a Property" deliberately downgraded to a text link to keep visual noise low |

**Pattern:** every top-scoring site (Lamudi, Hoppler, RentPad, Real.ph) has exactly **one** strong-contrast primary action, with any secondary action visually and functionally subordinate. Every low-scoring site has two or more actions competing for the same attention.

**For EstateHub:** keep one primary action, consistently labeled, everywhere on the page (this is already the plan — "Contact us" in nav, hero, and closing section). Given the Hoppler-style full-service positioning, RentPad's concierge pattern is worth considering as a deliberate second option: search stays self-serve and primary, but a distinct "talk to an agent" path (not a second "Contact us") could be the site's equivalent of RentPad's "Help me find a place" — a real design decision, not just a duplicate CTA with different words.

---

## 4. Colors

| Site | Palette |
|---|---|
| `Lamudi` | Disciplined two-tone: blue for logo/nav/links, one orange reserved for the primary CTA |
| `Dot Property` | Bright green nav, dark navy hero, orange CTAs, red on ad units/badges — **five-plus colors in the first screen** |
| `OnePropertee` | White background, consistent forest-green accent, warm-toned lifestyle photography (blush pink, navy, wood) instead of generic corporate blue |
| `Homes & Land` | Deep navy photo overlay, one cyan CTA, plus a *second*, slightly different blue on the chat bubble that competes with it |
| `Hoppler` | White background, blue logo mark, orange as the sole accent — restrained, similar discipline to Lamudi |
| `MyProperty.ph` | Lamudi's system with the accent swapped to green |
| `RentPad` | Lime-green wordmark, sky-blue hero photo, one amber/yellow CTA — warm color reserved for exactly one action |
| `Real.ph` | Distinctive teal/turquoise — **the least "generic real-estate blue/orange/green" palette of the eight** |

**Pattern:** one accent color, reserved exclusively for the primary action, reads as professional (Lamudi, Hoppler, RentPad, Real.ph). Four-plus colors on one screen reads as busy and dated (Dot Property, Homes & Land). Separately: **most competitors already cluster around blue, orange, or green** — Real.ph's teal stands out precisely because it doesn't.

**For EstateHub:** emerald + navy is already a disciplined two-color system — the right *pattern*. Worth knowing honestly: it is not the *most* differentiated color choice among these eight specifically, since OnePropertee (forest green) and MyProperty.ph (green) already occupy that hue. This is a finalized brand/logo decision, not something to silently revisit — flagging it as context for if the color conversation reopens, not a recommendation to change it.

---

## 5. Typography

| Site | Type |
|---|---|
| `Lamudi` | Rounded geometric sans headlines, clean system sans body, consistent hierarchy |
| `Dot Property` | Plain default Arial/Helvetica-style stack; the hero headline has no custom type treatment |
| `OnePropertee` | Bold, heavy-weight sans headline against lighter body — clear contrast, "most designed-feeling" of the free-tier sites |
| `Homes & Land` | Light-weight, generously spaced headline — elegant, but lower-contrast against busy photo backgrounds |
| `Hoppler` | **Serif display** ("We'll lead you home") paired with sans body/UI — the *only* site mixing serif and sans, reads more premium/editorial/brokerage-led |
| `MyProperty.ph` | Identical type system to Lamudi |
| `RentPad` | Bold, slightly rounded sans — consistent with a modern consumer product |
| `Real.ph` | Confident large-scale sans headline with a hand-drawn-style underline swash accent |

**Pattern:** custom, deliberate type treatment reads as premium (Lamudi, OnePropertee, Real.ph); default system stacks read as dated (Dot Property). Hoppler's serif is the one outlier choice in the whole set, and it's specifically what pushes it toward "brokerage" rather than "aggregator."

**For EstateHub:** Montserrat (display) + Inter (body) is already a deliberate custom pairing — the right pattern, not the Dot Property mistake. Worth a real conversation, not a unilateral change: Hoppler's serif choice is doing real positioning work (signaling "brokerage, not portal"), and EstateHub's current identity is sans-only. Whether that's worth revisiting is a brand call, not a build call — flagging it here so it's a deliberate decision either way.

---

## 6. Features

| Site | Notable features |
|---|---|
| `Lamudi` | For Sale/Rent toggle, location/project autocomplete, developer directory, pre-selling carousels, blog, large SEO footer |
| `Dot Property` | Buy/Rent + type + location + "Refine search," **overseas property search across a regional SE Asia network**, classifieds, news, awards |
| `OnePropertee` | **Income-based affordability filter** (a genuine buyer-pain-point differentiator), auto-generated video ads/social images, seller mini-sites, ~295K stated active buyers as social proof |
| `Homes & Land` | Listings across residential/commercial/land/farms/islands, agent verification badges, community forum, live chat bubble, phone number in the header |
| `Hoppler` | In-house licensed brokers (full-service commission model), rent-vs-buy calculator, neighborhood guides, "My Viewing List," Real Estate Magazine, Facebook Messenger widget |
| `MyProperty.ph` | Narrower than Lamudi: Buy, Rent, New Developments, Foreclosures only |
| `RentPad` | Rentals only — no "Buy" at all, a deliberately narrow scope — plus the "Help me find a place" concierge path |
| `Real.ph` | Offer Type / Property Type / Location + an expandable "Filters" panel with an active-filter-count badge, Real Estate Directory, Agent Tools section, blog |

**Pattern:** the strongest feature sets solve one *specific* user problem well (OnePropertee's affordability filter, RentPad's concierge path, Dot Property's overseas-buyer tools) rather than generically covering everything.

**For EstateHub:** the four-service range (Lease, Property Management, Sales, Business Solutions) is already broader than any single competitor's scope — none of the eight covers property management or B2B/commercial solutions as a first-class service alongside residential buy/rent/sell. That breadth is a real differentiator worth designing around rather than downplaying. Two specific opportunities the research surfaces:
- A **rent-vs-buy calculator** and **neighborhood guides** (Hoppler's playbook) fit a full-service-brokerage identity.
- **OFW/overseas buyers** are Dot Property's specific audience and a well-documented, major driver of PH real estate demand — yet Dot Property is otherwise cluttered and ad-heavy. A clean, EstateHub-quality overseas-buyer path is a legitimate, currently-underserved angle worth a direct conversation with the user, not something to add unilaterally.

---

## 7. Strengths (cross-site, best-in-class)

- **Hoppler** — full-service trust positioning, authentic local photography (a real Filipino family, not stock), the cleanest CTA hierarchy of the eight, Messenger integration that matches local habits.
- **RentPad** — nav-embedded persistent search (the audit's single best-rated pattern), a concierge CTA as a genuine alternative to self-serve, tight rentals-only scope that keeps the whole page uncluttered.
- **Real.ph** — the most distinctive brand color in the category, upscale photography/typography signaling premium positioning, an active-filter-count badge as a small but modern UX detail.
- **OnePropertee** — the warmest, most authentic lifestyle photography of the group, clear dual-path buyer/seller storytelling, a genuinely useful affordability filter, a transparent low-friction listing model.
- **Lamudi** — two-color brand discipline, a clear single-CTA hierarchy, an SEO footer that's a plausible organic-traffic driver despite looking unglamorous.

## 8. Weaknesses (cross-site, cautionary)

- **Homes & Land** — no search bar above the fold at all: the single biggest UX gap found in the entire audit.
- **Dot Property** — an above-the-fold ad banner plus stacked competing CTAs: the highest visual clutter of any site reviewed.
- **MyProperty.ph** — reads as a reskin of its own parent brand (Lamudi), with no distinct value proposition of its own — a cautionary example, not a template.
- **OnePropertee** — a six-item top-right cluster of secondary actions causes real decision paralysis about which CTA matters.
- **RentPad** — a cookie-consent banner was observed literally overlapping its own primary search button: a real, live usability bug, not a hypothetical one.
- **Cross-cutting**: generic, unlocalized stock photography (Lamudi, MyProperty, Dot Property); an industry-wide cluster around blue/orange/green; and — importantly — **the entire audit is desktop-only**, despite Philippine web traffic skewing heavily mobile. None of the patterns above have been mobile-validated by this research.

---

## Rebuild priorities, in rough order of impact

1. **Confirm the brokerage-vs-portal positioning** with the user before anything else — it changes what "primary CTA" and "features" even mean.
2. **Add persistent, nav-embedded search.** Concrete, specific, and independently the highest-rated single pattern in the whole audit.
3. **One primary CTA, one label, used everywhere** — already the plan, keep it.
4. **Cap nav at 5–6 top-level items**, push anything else into dropdowns or an account menu.
5. **Design and test mobile explicitly** — the source research never did, and it's the dominant PH usage context.
6. Consider the **OFW/overseas-buyer angle** and a **rent-vs-buy calculator / neighborhood guides** as features that fit a full-service identity better than a generic listings-portal feature list.
7. Keep authentic-photography and Messenger-widget plans from the original audit summary — both independently reconfirmed here.
8. Treat **color** (already locked to emerald) and **serif-vs-sans typography** (Hoppler's specific premium/brokerage signal) as known, named trade-offs — not silent defaults — if either comes up again.
