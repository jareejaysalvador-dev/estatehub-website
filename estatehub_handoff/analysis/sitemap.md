# EstateHub.ph — Website Structure (Sitemap)

## Context

The first homepage build was archived because it was designed from a secondhand summary rather than the primary research. We restarted from the sources: the 8-competitor landscape (`estatehub_handoff/research/PH_Real_Estate_Competitive_Landscape.xlsx`), the design/UX audit (`estatehub_handoff/design-audit/PH_Real_Estate_Design_Audit.docx`), and the synthesis written from them (`estatehub_handoff/analysis/research-synthesis.md`).

Decisions already confirmed by the user that this sitemap is built on:

- **EstateHub is a full-service brokerage** (Hoppler's model: licensed brokers handle the transaction) — not a self-serve listings portal. No "post your property free" flows anywhere; sellers and buyers both convert through an agent.
- **Listings are structured from day one** — real inventory only, however small.
- **OFW/overseas buyers get a dedicated top-level page**, cross-linked from services.
- **Resources (guides + calculator) are structured now, launched later** (phase 2).
- Brand: navy/emerald, EB Garamond display headlines, Montserrat wordmark, Inter body.

This plan is **IA/sitemap only**. Page-by-page visual design (taste-skill treatment) and any build are separate later steps, each gated on explicit approval.

## Sitemap

```
/                           Home
/properties                 Property listings (filterable results)
/properties/[slug]          Property detail
/services/sales             Sales (buying AND selling through EstateHub)
/services/lease             Lease (renters and landlords)
/services/property-management   Property Management
/services/business-solutions    Business Solutions (commercial / B2B)
/overseas                   Overseas Filipinos (OFW buyers & remote owners)
/about                      About EstateHub (story, licensed brokers, team)
/contact                    Contact (the primary conversion page)
/guides                     [Phase 2 — reserved, unlinked at launch]
/guides/rent-vs-buy-calculator  [Phase 2]
/guides/[area]              [Phase 2 — neighborhood guides]
/privacy                    Privacy policy (PH Data Privacy Act — required with lead forms)
/terms                      Terms of use
404                         Not-found page
```

## Navigation spec (from the audit's hard rules)

**Header, desktop:** logo → Properties · Services ▾ (dropdown: Sales, Lease, Property Management, Business Solutions) · Overseas Buyers · About → persistent search field → **Contact us** (the one primary CTA, emerald).

- 4 visible text items + search + 1 CTA — under the audit's 5–6 cap (Dot Property's 9-item nav is the cautionary example).
- **Persistent nav-embedded search** (RentPad's pattern — the audit's single best-rated interaction) targeting `/properties?query=…`. Present on mobile header too, not desktop-only; the audit never validated mobile and PH traffic skews mobile, so mobile behavior is specified at design time, not assumed.
- One CTA label site-wide: **"Contact us"** — never "Get in touch"/"Let's talk" variants (one-intent-one-label rule).

**Footer:** services links, company links (About, Overseas, Contact), contact info, "Trusted. Secure. Committed." strip, `/privacy` + `/terms`. **No giant SEO city-matrix at launch** — that's a portal-scale organic play (Lamudi's); revisit only if listings volume ever justifies it.

**Site-wide:** Facebook Messenger widget (not a generic chat bubble — matches local contact habits, per audit).

## Page purposes (one line each + the research it answers)

| Page | Job | Research grounding |
|---|---|---|
| Home | Route 4 audiences (buyer, renter, owner, business) + overseas strip; search above the fold; one CTA per section | Search-in-hero is table stakes (Homes & Land's missing search = worst gap found); OnePropertee's dual-path storytelling, minus its 6-item CTA clutter |
| Properties | Filterable real inventory (location, type, budget, buy/rent) | Gives nav/hero search a real destination; Real.ph's filter-count badge noted for design time |
| Property detail | Gallery, specs, price, neighborhood blurb, **agent contact block as the conversion** | Brokerage model: the listing sells the conversation, not a self-serve checkout |
| Services ×4 | What we do / how it works / who it's for / FAQ / one CTA; overseas cross-link on Sales + Property Management | Founder's four confirmed services; no competitor treats PM or B2B as first-class — a breadth differentiator |
| Overseas | Remote transaction process, POA guidance, timezone-aware contact | Dot Property owns this audience but is cluttered/ad-heavy; clean version = differentiation; also serves remote *owners* for PM |
| About | Story, PRC-licensed brokers, real team — no fabricated credentials | Trust-first positioning; audit: authentic beats stock |
| Contact | Form (name, intent, service, preferred channel), phone, email, Messenger, timezone note | Every "Contact us" lands here; Hoppler's clean single-secondary-action hierarchy |
| Guides (P2) | Rent-vs-buy calculator + neighborhood guides | Hoppler's trust playbook; structured now so IA doesn't shift later |

## Explicitly not in this sitemap (and why)

- Free-listing / "post your property" flows, agent directories, developer directories, classifieds, pricing tiers — portal features; EstateHub is a brokerage.
- Blog/magazine beyond the phase-2 guides — content commitment not made.
- User accounts / saved listings (Hoppler's "My Viewing List") — needs auth; deferred, noted as a phase-2+ candidate.
- Ads/affiliate anything — the audit's clearest trust-killer (Dot Property).
- Fake content of any kind: no fabricated testimonials, listings, credentials, or team members at any phase.

## Phasing

- **Launch:** Home, Properties (+details, real inventory), 4 service pages, Overseas, About, Contact, privacy/terms, 404, Messenger widget.
- **Phase 2:** Guides section (calculator, neighborhood guides), then evaluate saved-listings/accounts.

## Verification (for this sitemap)

- Every takeaway in `CLAUDE.md` → "Competitive research and design audit" maps to a sitemap decision above (nav search ✓, nav cap ✓, one CTA ✓, mobile-explicit ✓, Messenger ✓, no ads ✓, OFW ✓, brokerage features ✓).
- Nav count ≤ 6 visible items; exactly one CTA label site-wide.
- Each page names its single conversion job.
- No portal-model language anywhere in the IA.

## After approval (separate, gated steps — not authorized by this plan)

1. Design phase: taste-skill page-by-page visual/layout plan for each launch page (starting with Home), presented for approval.
2. Only after design approval: scaffold + build.
