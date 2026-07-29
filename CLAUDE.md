# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

**Restarting from the research, on purpose.** A first homepage build (Next.js 16 + Tailwind v4) was done, but without first reading the primary research/design-audit source files — only a secondhand summary. That build has been archived (not deleted) at `_archive-first-build/` for reference, but it is **not the starting point** for the next attempt. Don't resume from it or copy its structure without re-deriving decisions from the sources below.

There is currently no scaffolded code in this directory. Before writing any, read `estatehub_handoff/research/PH_Real_Estate_Competitive_Landscape.xlsx` and `estatehub_handoff/design-audit/PH_Real_Estate_Design_Audit.docx` directly (not just this file's summary of them — that's exactly the mistake being corrected). Neither `pandoc`, `LibreOffice`/`soffice`, nor a working `python` are available in this environment; both were read by unzipping and parsing the raw OOXML (`unzip file.xlsx`, then read `xl/worksheets/*.xml` / `word/document.xml`, or use a small Node script with the `xlsx` npm package for the spreadsheet). The `.docx` also has 8 embedded screenshots at `word/media/*.jpg` (mapped to sites via `word/_rels/document.xml.rels`, in document order) — view them directly, they confirm the audit's claims (e.g. RentPad's cookie banner really does overlap its search button).

## Layout

- `estatehub_handoff/` — all handoff materials (read `estatehub_handoff/CLAUDE.md` for the full original handoff note this file summarizes)
  - `research/PH_Real_Estate_Competitive_Landscape.xlsx` — competitive analysis of 8 PH real estate portals (Lamudi, Dot Property, OnePropertee, Homes & Land, Hoppler, MyProperty.ph, RentPad, Real.ph): ownership, target audience, business model/pricing, relative traffic, strengths/weaknesses
  - `design-audit/PH_Real_Estate_Design_Audit.docx` — live visual UX audit of the same 8 sites with screenshots, scored on layout/nav/CTA/colors/typography/features, plus cross-site patterns and prioritized recommendations
  - `logo-kit/` — final logo assets (SVG/PNG/favicon/lockups) plus its own `README.md` with usage rules
  - `mockup/original-homepage-mockup.png` — founder's original homepage mockup (gold accent throughout)
- `estatehub_handoff.zip` — archival copy of `estatehub_handoff/`; same contents, not a separate source of truth
- `_archive-first-build/` — the abandoned first attempt (Next.js source, `public/`, configs). Reference only.

## What EstateHub.ph is

A premium, trust-first Philippine real estate website. Positioning line from the founder's homepage mockup: *"Building generational wealth, one move at a time."* Services: Lease, Property Management, Sales, Business Solutions. Tone: established and secure (bank-like), not playful (startup-like).

**Confirmed business model: full-service brokerage**, matching Hoppler (commission-based, in-house licensed brokers handle the whole transaction), not a self-serve listings portal (Lamudi, OnePropertee, Dot Property, RentPad, Real.ph). This is settled, not an open question — it decides what "primary CTA" and "features" mean:
- "Contact us" / talking to an agent is the concierge/conversion path, not a secondary alternative to it — don't add a redundant separate "concierge" CTA (e.g. RentPad's "Help me find a place") on top of it.
- No self-serve-portal language ("free listing," "post your property") anywhere — sellers reach EstateHub the same way buyers do, through an agent.
- Search is the self-serve *complement* to "Contact us," not a competing primary action.
- Feature priorities follow Hoppler's playbook over a portal's: rent-vs-buy calculator, neighborhood guides, saved-listings, Messenger widget — not developer directories, classifieds, or lead-package pricing tiers.

**Confirmed: OFW/overseas buyers are a named audience, built in from the start** — not a later add-on. Dot Property is the only competitor serving this audience, and it's otherwise cluttered/ad-heavy, so a clean version is a real differentiator for a brokerage already selling "one point of contact." This needs actual supporting content, not a passing mention: a remote-transaction process explainer, Power of Attorney (POA) guidance (the standard real concern for a buyer who can't be physically present), and timezone-aware contact options. Likely surfaces as its own nav/section, or folded into how Sales and Property Management each explain themselves for a remote owner — decide the exact IA when building, but the audience and content commitments above are settled.

**Confirmed: introduce a serif for on-page headlines.** Matches Hoppler's specific premium/brokerage-not-portal signal (the one thing that most visibly separates it from every listings portal in the audit). Scope: this is for **headline/editorial copy only** (H1s like the hero headline, section headings) — the finalized wordmark/logo (`ESTATEHUB.PH` in Montserrat) does not change; Inter stays as the body/UI font.

Specific choice: **EB Garamond**, not Cormorant Garamond. Reasoning: Cormorant Garamond is already the serif in use on the unrelated Aya Hills project in this same workspace, and reusing it here would just be a repeated default rather than a considered pick. Playfair Display (the other obvious free option) is a high-contrast, fashion-editorial serif that reads more "luxury magazine" than "established, bank-like trust" — EB Garamond is a classical old-style Garamond revival, the same family long used in legal/financial/publishing contexts specifically for its credible, unshowy feel, which fits EstateHub's brief better than Playfair's drama. Revisit if you disagree, but don't default back to Cormorant Garamond or Playfair without a reason.

## Brand system

| Token | Hex | Use |
|---|---|---|
| Midnight Navy | `#0E1A2C` | primary background / logo tile |
| Deep Ink | `#091120` | darker backgrounds |
| Emerald | `#22B573` | new primary accent — logo mark, `.PH` |
| Deep Emerald | `#178A57` | emerald fills / hover states |
| Mint | `#8FDCBD` | emerald tint / on-dark secondary text |
| Estate Gold | `#E3A94D` | legacy accent from the original mockup, superseded by emerald (see below) |
| Champagne | `#F2CE8C` | gold tint |
| Porcelain | `#F5F2EB` | light backgrounds |

Fonts: Montserrat (headings/wordmark — ESTATE in Light 300, HUB in Bold 700, `.PH` in SemiBold 600 emerald) + Inter (body/UI), both free via Google Fonts. The logo-kit concept file (`estatehub_handoff/logo-kit/estatehub_concept_a_emerald.html`) defines these as CSS custom properties on `:root` — follow that convention for any new HTML mockups.

Logo: Hub Frame monogram (Concept A), emerald mark on a navy tile, paired with the ESTATEHUB.PH wordmark. Master asset is `logo-kit/svg/icon-primary.svg`; see `logo-kit/README.md` for full usage rules (flat color only, no gradients/shadows, clear-space rule, don't recolor or restyle the wordmark). There's also a navy-ink variant (`svg/icon-mark-navy-transparent.svg`) explicitly meant for light surfaces — relevant if a light theme is built.

## Accent color: resolved to full emerald

The original homepage mockup used **gold** throughout (headline accent word, divider line, arrow icons, CTA buttons); the finalized logo is **emerald**. Resolved in favor of **full emerald** — gold is dropped from site UI entirely (Estate Gold/Champagne tokens above are legacy reference only). Matches the design audit's own advice to reserve one accent color exclusively for the primary action. Worth knowing: green is not a maximally-differentiated choice among these competitors specifically (OnePropertee uses forest green, MyProperty is a green re-skin of Lamudi) — Real.ph's teal is the audit's example of a color that reads as distinctive. Emerald is a locked brand/logo decision, not up for silent revision, but flag this to the user if the rebuild conversation touches color again.

## Competitive research and design audit — full analysis

A complete synthesis of both source documents (layout, navigation, CTA placement, colors, typography, features, strengths, weaknesses, per-site and cross-site, plus EstateHub-specific recommendations) was written up in full during the planning conversation that preceded this restart. Regenerate or ask for that analysis if it isn't already visible in the current conversation — don't re-derive it from scratch if it was already produced. Headline points that should survive into any rebuild:

- **Persistent, nav-embedded search** (RentPad's pattern) is called "arguably the single best interaction-design pattern found across all eight audits" — the first build only had search in the hero, not the nav. Fix this next time.
- Homes & Land's homepage has **no search above the fold at all** — called the single biggest UX gap in the whole audit. Don't repeat it (the first build didn't).
- **One disciplined accent color** beats multi-color pages (Lamudi, Hoppler, RentPad, Real.ph vs. Dot Property's 5+ colors and Homes & Land's competing blues).
- **Cap primary nav at 5–6 items**; push secondary actions into dropdowns/account menus (Dot Property's 9-item nav and OnePropertee's 6-item secondary cluster are the cautionary examples).
- **Authentic local photography** (Hoppler's real Filipino family, OnePropertee's lifestyle shots) reads as more trustworthy than generic stock (Lamudi/MyProperty/Dot Property).
- Messenger/WhatsApp-style chat, not a generic chat bubble, matches local user habits.
- The audit's screenshots are **desktop-only** (~1280px) — mobile/responsive was explicitly not covered, despite PH traffic skewing heavily mobile. Don't assume desktop-audited patterns transfer to mobile without checking.
- Dot Property specifically serves **OFW/overseas buyers** with dedicated cross-border tools — confirmed as a built-in-from-the-start audience for EstateHub, see above.
- Competitors named in the research but not deeply audited: Trovit PH, FazWaz.ph, Presello, DMCIHomes.com, HousingInteractive.com.ph.

Full write-up: `estatehub_handoff/analysis/research-synthesis.md` (also published as an Artifact during planning).

## Approved sitemap

The site structure was planned from the research and **approved by the user** — full spec (page purposes, nav rules, phasing, exclusions) in `estatehub_handoff/analysis/sitemap.md`. Summary:

- **Launch pages:** `/` · `/properties` + `/properties/[slug]` (real inventory only) · `/services/{sales,lease,property-management,business-solutions}` · `/overseas` (OFW buyers & remote owners: remote process, POA guidance, timezone contact) · `/about` · `/contact` (the conversion page) · `/privacy` · `/terms` · 404
- **Phase 2 (structured, unlinked at launch):** `/guides` — rent-vs-buy calculator, neighborhood guides; later evaluate saved-listings/accounts
- **Nav:** Properties · Services ▾ · Overseas Buyers · About + persistent nav-embedded search (→ `/properties`) + one "Contact us" CTA (emerald). One CTA label site-wide. Facebook Messenger widget site-wide.
- **Never:** portal features (free-listing flows, directories, classifieds, pricing tiers), ads, fabricated content of any kind.

## User journeys (planned)

Six audience journeys mapped across the sitemap in `estatehub_handoff/analysis/user-journeys.md`: local buyer, renter, seller, owner→management (incl. remote-owner variant), OFW/overseas buyer, business client. All share one framework (Arrive → Orient → Evaluate → Contact → Handoff) and one conversion (a broker conversation — "Contact us"). Load-bearing conclusions: the property detail page (not the homepage) is the conversion surface for property-seekers; `/services/sales` must preempt the portal-trained "where do I post my listing?" expectation head-on; `/overseas` is the ad/referral landing page for OFW journeys with POA/remote-process orientation (no legal/financial advice); the contact form captures intent + property reference + preferred channel + preferred time/timezone; Messenger is co-primary for renters and overseas users. The doc ends with 5 open business questions (response SLA, staffed channels, inventory source, broker roster w/ PRC numbers, tenant fees) that must be answered before Handoff-stage promises go on the site.

## Launch content intake (blocking real copy, not design/build)

`estatehub_handoff/intake/launch-content-intake.xlsx` is a fill-in workbook for the 5 open business questions above: Channels (which contact methods are actually staffed), Listings (real inventory template), Broker Roster (names + PRC license numbers, feeds `/about` and listing agent blocks), Policies (tenant fees, response-time targets). Each data tab has one example row (yellow fill, italic, labeled) showing format only — never treat it as real data. Generated with `exceljs` via Node, not the xlsx skill's usual `openpyxl`/`pandas`/`markitdown` — this environment has no working Python (`python`/`py` resolve to Windows Store stub shims only); the same workaround applied when reading the original research `.xlsx`/`.docx` files.

## UX recommendations (planned)

`estatehub_handoff/analysis/ux-recommendations.md` covers 8 friction areas (navigation, typography, spacing, hierarchy, buttons, load performance, accessibility, mobile) with concrete, testable specs — not generic advice. Load-bearing specifics the design/build phases must honor: EB Garamond restricted to headline sizes only (24px+, never body/labels/small print) and to the single top hierarchy level per page; nav-embedded search must survive mobile collapse (don't let it quietly become hero-only again); 44×44px minimum touch targets; WCAG AA contrast verified against the navy/emerald/porcelain palette *before* the visual system locks; property photos need real descriptive alt text, not decorative/empty; LCP target under 2.5s on mid-tier mobile; mobile is designed fresh and tested on real Android devices — the source competitive audit was desktop-only and validates nothing about mobile.

## UI design system (planned)

`estatehub_handoff/analysis/ui-design-system.md` specifies concrete tokens/rules across the 10 UI fundamentals (color roles, typography scale, spacing scale, contrast, alignment, grid, icons, button states, cards, forms). Critical verified facts — these came from computing real WCAG ratios, don't contradict them: **Emerald `#22B573` text on Porcelain fails contrast (2.4:1) — use Deep Emerald `#178A57` for large text only, never body-size; button text on Emerald fill must be Deep Ink (7.1:1), never porcelain/white (2.4:1, fails)**. New tokens introduced there: Slate `#5B6B82` (muted text on light, 4.85:1 AA-pass) and Error `#B3402E`. Shape system: cards 16px radius, buttons pill, inputs 8px. Icons: Phosphor, `light` weight only. **Confirmed by the user: porcelain-first content pages with navy reserved for nav/hero/footer/accent bands (~60/30/10 porcelain/navy/emerald)** — supersedes the archived build's dark-only approach. The design system is now fully locked; changes require explicit user sign-off, not silent revision.

## Responsive design spec (planned)

`estatehub_handoff/analysis/responsive-design-spec.md` specifies phone/tablet/desktop behavior for buttons, readability, navigation, forms, and images — the one area the desktop-only competitive audit validates nothing about. Load-bearing specifics: design target is **360px mid-range Android first** (PH market reality), not iPhone; phone header = logo mark + compact "Contact us" pill + one-tap expanding search icon + hamburger (keeps the audit's top-rated nav-search pattern alive on mobile — arithmetic verified to fit at 360px, confirm on device); tablet keeps hamburger but inlines the search field; dropdowns open on click as well as hover; phone property-detail pages get a **sticky bottom "Inquire" + Messenger bar** (the mobile expression of the agent-block conversion); inputs ≥16px font (iOS zoom), correct `type`/`inputmode` per field, native pickers on touch; image weight budgets hero ≤200KB / thumbs ≤60KB, art-directed hero crops, LCP image never lazy. Ends with a per-class testing checklist requiring a real mid-range Android device.

## Accessibility spec (planned)

`estatehub_handoff/analysis/accessibility-spec.md` makes the locked WCAG 2.1 AA baseline concrete across keyboard navigation, contrast, alt text, form labels, focus indicators, and font sizes, plus cross-cutting structure (landmarks, one h1/page, `lang` attributes, reduced-motion). **It produced two user-approved amendments to the locked design system, now recorded in `ui-design-system.md`: focus rings are Deep Emerald on light surfaces / Emerald-Mint on dark (plain Emerald on Porcelain fails 1.4.11 at 2.4:1), and input borders use Slate `#5B6B82` on light surfaces (the card hairline fails as a control boundary).** Other binding rules: no positive tabindex; skip link; galleries never swipe-only; focus never obscured by sticky elements (`scroll-margin`); error summaries with `aria-describedby`/`aria-invalid`; `aria-live` on async submits; rem-based sizing, 200% zoom + 320px reflow must pass; never disable user zoom. Its testing checklist (keyboard-only journeys, NVDA + TalkBack smoke tests, axe as floor-not-bar) joins the responsive checklist as the build-phase gate.

## Security spec (planned)

`estatehub_handoff/analysis/security-spec.md` covers HTTPS, admin authentication, backups, updates, spam protection, and input validation — separating binding-now rules from architecture-pending items (exact CSP, hosting platform, listing data store, inquiry destination). Confirmed facts: **the domain registrar is GoDaddy** (2FA + transfer lock on day one; verify `.ph` DNSSEC support rather than assume it). Load-bearing rules: MFA mandatory on every operational account (registrar, DNS, host, git, Meta Business, and the inquiry inbox — the PII crown jewel); **step zero of backups is making this a git repo (it currently isn't)** plus a restore test before launch; spam protection is tiered and invisible-first (honeypot → rate limit → format checks → Turnstile only if data demands; no visible CAPTCHA on the sole conversion surface by default); SPF/DKIM/DMARC mandatory (brokerage email spoofing = highest-damage cheap attack); server-side validation always (client-side is UX); header-injection stripping on form fields; no file uploads anywhere at launch; no `dangerouslySetInnerHTML` with user content. **One flagged posture awaiting user confirmation: static-first, zero-admin-surface launch architecture** (one dynamic endpoint — the inquiry form; no DB, no login, no public admin panel). Its verification checklist joins the responsive + accessibility checklists as the build-phase gate.

## Working agreement / next steps

**Phases are explicitly gated: the user approves each transition (discussion → planning → design → build). Do not start — or frame questions presuming — the next phase without their go-ahead.** Sitemap approval did NOT authorize design or build.

When the user green-lights the design phase: taste-skill page-by-page visual/layout plan (starting with Home), presented for approval before any code. Build phase (fresh scaffold — Next.js was the prior choice, re-confirm rather than assume; don't copy `_archive-first-build/`) only after design approval, with EB Garamond + Montserrat + Inter wired from day one.
