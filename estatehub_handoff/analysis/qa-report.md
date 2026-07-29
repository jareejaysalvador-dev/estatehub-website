# EstateHub.ph — Stage 5 QA Report

*Final QA gate of the approved build plan (`estatehub_handoff/analysis/` design docs → design+build plan → Stages 0–5). Covers the responsive, accessibility, and security-dev-scope checklists promised in those docs, plus a taste-skill pre-flight and a page-by-page check against `ux-recommendations.md`'s design demands. Everything found was fixed, not just logged — see "Bugs found and fixed" below.*

## Result summary

`npm run lint` and `npm run build` both pass clean. All 23 routes build; 22 are static, `/api/inquiry` is the only dynamic route, matching the static-first architecture. Zero horizontal overflow at 320/375/1280px on every page after fixes. Zero em-dashes, zero stray colors outside the design-system tokens, eyebrow budget (≤1/page) respected everywhere. Three real bugs were found during this pass and are fixed and committed; see below. Two things are honestly not verified in this environment (real-device testing, formal Lighthouse/LCP measurement) — flagged, not silently skipped.

## Bugs found and fixed during this QA pass

**1. Mobile horizontal-overflow bug (homepage, all pages with a `Reveal`-wrapped scroll carousel).** At 320px width, the homepage's featured-properties carousel forced a page-wide horizontal scrollbar (`document.documentElement.scrollWidth` 997px against a 320px viewport). Root cause, isolated by A/B testing computed styles directly rather than guessing: Framer Motion's `Reveal` wrapper renders its `initial` pre-animation state (`opacity:0; transform:translateY(24px)`) via inline style, including during SSR, so every real user sees this state for a brief window on every page load until `IntersectionObserver` fires `whileInView`. The `transform` alone (not `opacity`) causes the ancestor chain's `scrollWidth` computation to stop respecting the carousel's own `overflow-x:auto` containment, ballooning every ancestor up to `<html>`. Fixed with `overflow-x-hidden` on the section wrapper in `FeaturedProperties.tsx` — confirmed this doesn't affect the carousel's own intended internal horizontal scroll (verified at both 320px and 1280px after the fix). This is the only place in the codebase combining `Reveal` with an `overflow-x-auto` descendant, confirmed by grep.

**2. "Three equal feature cards" pattern on `/about`.** The three brokerage principles were rendered as a `grid-cols-1 md:grid-cols-3` row of identical bordered cards — exactly the anti-pattern the approved build plan's taste-skill rules call out to avoid. Replaced with the same divided-row treatment (icon + title + detail, hairline dividers, no card chrome) already used by `WhyEstateHub` on the homepage, for both rule-compliance and visual consistency between the two "why trust us" moments on the site.

**3. Missing active nav-state indication and service-page breadcrumbs.** Both are explicit items in `ux-recommendations.md`'s navigation category ("the user should always be able to tell which section they're in"; "breadcrumbs on `/properties/[slug]` and `/services/*`") that were never implemented. Fixed: `Header.tsx` now marks the current nav item with `aria-current="page"` plus a visual indicator (underline on desktop, bold on mobile); `Properties` uses prefix matching so listing detail pages still register as current, `Services` activates for any `/services/*` route. `ServiceTemplate.tsx` gained a Home → Services → [service] breadcrumb matching the pattern already on `/properties/[slug]` ("Services" is plain text, since no `/services` index page exists in the approved sitemap).

## Page-by-page result against `ux-recommendations.md`'s 8 categories

| Page | Nav | Typography | Spacing | Hierarchy | Buttons | Load | A11y | Mobile |
|---|---|---|---|---|---|---|---|---|
| Home | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ (bug fixed) |
| Properties | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ |
| Property detail | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ |
| Services ×4 | ✓ (fixed) | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ |
| Overseas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ |
| About | ✓ | ✓ | ✓ | ✓ (fixed) | ✓ | ✓* | ✓ | ✓ |
| Contact | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ |
| Privacy / Terms | ✓ | ✓ | ✓ | ✓ | n/a | ✓* | ✓ | ✓ |
| 404 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ |

`✓*` = architecturally sound (static prerendering, `next/image`, `next/font` with default `swap`, deferred/script-free Messenger link) but no formal Lighthouse/Core Web Vitals measurement was run in this environment — see limitations below.

## What was specifically verified this session (not just re-asserted)

- **Keyboard-only journey**: skip link confirmed as the very first focusable element; full desktop nav tab order walked; Services dropdown opens, closes on Escape (with focus correctly returned to the trigger button), and supports Arrow-key navigation between items, all confirmed via real dispatched keyboard events; property gallery confirmed keyboard-operable (arrow keys advance the real `<button>`-based Previous/Next controls); contact form's error summary confirmed to receive programmatic focus on validation failure, listing all three required-field errors correctly.
- **Focus indicators**: empirically confirmed via computed styles on a real Tab-focused element — no outline on non-keyboard focus, a real 2px solid `#178a57` (Deep Emerald) outline on genuine keyboard focus, exactly matching the locked design system and its accessibility amendment.
- **Responsive reflow**: every one of the 9 launch page types measured for horizontal overflow at 320px via real DOM geometry (`scrollWidth` vs `clientWidth`), not just visual inspection — all clean after the carousel fix. Cross-checked the carousel still scrolls correctly at 1280px post-fix.
- **Color-token discipline**: a codebase-wide grep for arbitrary hex colors and default Tailwind palette classes (gray/blue/red/etc.) outside the design system returned zero matches.
- **Em-dash and eyebrow budget**: zero em-dashes anywhere in `src/`; every page has 0 or 1 eyebrow-style label before its H1 (services pages and the 404 page have exactly 1; every other page has 0), within the ≤1/page budget.
- **Nav-label consistency**: footer link labels checked character-for-character against header labels — exact match, no synonym drift ("Properties" everywhere, never "Listings").
- **Security route**: `src/app/api/inquiry/route.ts` re-read in full against the security spec — honeypot, min-time check, allowlists, header-injection stripping (correctly scoped to header-bound fields, not the free-text message body), rate limiting, and the honest `delivered:false` fallback are all present and correctly reasoned.

## Honestly not verified (flagged, not skipped)

- **Real mobile device testing.** Both the responsive spec and the UX recommendations explicitly call for testing on a real mid-range Android device, not just a simulator — this session's testing used browser viewport emulation only (a technical limitation of the current environment also meant most interaction testing used direct DOM/keyboard-event dispatch rather than simulated touch/pointer input). This remains an open pre-launch item.
- **Formal performance measurement.** No Lighthouse run or real Largest Contentful Paint measurement was taken against the 2.5s mid-tier-mobile target. The architecture (static prerendering, `next/image`, deferred/script-free Messenger) is sound for it, but the number itself is unverified.
- **Screen-reader smoke tests.** NVDA/TalkBack testing from the accessibility spec's checklist was not run (no assistive-tech environment available here); axe or a similar automated scan was likewise not run. Manual keyboard/focus/ARIA verification (above) was done in its place, which covers a meaningful subset but isn't a substitute.

## Explicitly out of scope (per the approved build plan, unchanged)

Deployment, hosting, and GoDaddy DNS configuration; real photography (current images are hand-verified Picsum placeholder IDs — a swap list, not final assets); real broker roster and listing content (the launch-content-intake workbook is still unfilled; every placeholder is clearly labeled in the UI itself, not just in code comments); the Messenger page ID and the inquiry form's destination webhook; `/guides` (phase 2); analytics.

## Immediate next step

A deployment conversation: hosting platform, GoDaddy DNS cutover, and the environment variables (`INQUIRY_WEBHOOK_URL`, `NEXT_PUBLIC_FB_PAGE_ID`) that turn the currently-honest "not configured yet" states into live ones. Real content (broker roster, listings) can be filled into the intake workbook in parallel, independent of deployment.
