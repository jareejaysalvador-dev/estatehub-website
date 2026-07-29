# EstateHub.ph — UX Recommendations (Friction Reduction)

*Builds directly on `research-synthesis.md`, `sitemap.md`, and `user-journeys.md`. Where the competitive research already answered a question, this doc cites it rather than re-deriving it. Where the research is silent — mobile validation, accessibility, performance, none of which the source audit tested — this draws on general UX/WCAG/Core Web Vitals practice instead. Planning only; no design or build implied.*

Every one of the 8 areas below is a different source of friction between "I have a question" and "I'm talking to a licensed broker" — the one conversion the whole site exists to produce. They compound: a beautiful page that loads slowly still has friction; an accessible page with confusing navigation still has friction.

---

## 1. Clear navigation

**Already settled** (`sitemap.md`): 4 visible items + Services dropdown, persistent nav-embedded search, one "Contact us" CTA — under the audit's 5–6 item cap. That's the foundation; these recommendations are about not eroding it in execution.

- **Active-state indication** on every nav item — the user should always be able to tell which section they're in, especially with 6 different journeys entering the site at different pages.
- **Breadcrumbs** on `/properties/[slug]` and `/services/*` (Home > Properties > [listing title]) — orientation on deep pages, and free SEO structure.
- **Search must not collapse into the hamburger on mobile.** It's the single highest-rated pattern in the whole competitive audit; if it quietly becomes "tap menu, then find search" on small screens, we've rebuilt Homes & Land's mistake by omission. Specify its mobile treatment explicitly at design time.
- **"Contact us" stays reachable in the mobile collapsed state** — sticky or otherwise always-visible, not buried a tap deep. It's the single conversion action across all 6 journeys.
- **Footer nav labels match header labels exactly** — no synonyms ("Properties" everywhere, never "Listings" in one place and "Properties" in another).

## 2. Readable typography

**Already settled**: EB Garamond (headlines) + Montserrat (wordmark only) + Inter (body).

- **Body text ≥16px, line-height 1.6, max-width ~65 characters** per line. Never smaller for anything a user needs to read to make a decision (descriptions, policies, form copy).
- **EB Garamond is restricted to large headline sizes only (24px and up)** — never body copy, form labels, or small print. Serifs lose legibility fast at small sizes on lower-quality mobile screens, and the whole reason it was chosen (Hoppler's premium-brokerage signal) only works if it stays reserved for moments that matter, not diluted into everyday UI text.
- **WCAG AA contrast (4.5:1 body / 3:1 large text) must be checked, not assumed**, specifically against the navy/emerald/porcelain palette — dark themes and colored-text-on-color combinations are exactly where contrast quietly fails. Verify before the design phase locks the visual system, not after components are built.
- **Tabular figures for aligned numbers** — prices and specs (beds/baths/sqm) on property cards should line up in a grid, not wobble because "1" and "8" have different widths in the default figure style.

## 3. Consistent spacing

- **One spacing scale, used everywhere** (e.g. an 8px-based scale: 8/16/24/32/48/64) — no arbitrary one-off margin/padding values. Easier to keep consistent, easier to maintain later.
- **Identical internal padding across all card types** — property cards, service cards, broker cards should share the same internal rhythm even though their content differs.
- **Section spacing scales with content density**, deliberately — a listings-heavy page (`/properties`) and an airy page (`/about`, hero) shouldn't use identical vertical rhythm, but the *variation* should be a designed choice, not an accident of whoever built which page.

## 4. Strong visual hierarchy

**Already validated by the research**: Lamudi/Hoppler/RentPad/Real.ph's one-accent-color, one-primary-CTA discipline reads as professional; Dot Property/Homes & Land's competing colors and CTAs read as cluttered and dated.

- **Reserve EB Garamond for the single top level of hierarchy per page** — the hero H1, maybe one major section header. Using it at every heading level flattens the exact signal it exists to send; a serif used everywhere isn't a hierarchy, it's a font choice.
- **The one-CTA discipline extends to every page**, not just the homepage — property detail, all four service pages, About, Overseas. Each needs exactly one primary action, visually and functionally dominant.
- **Squint test**: viewed small or blurred, the single most important element on any page (headline or CTA) should still be the obvious focal point. If two things compete for attention, one of them loses on purpose.

## 5. Obvious buttons

- **One style per action type, used identically everywhere**: primary = filled emerald pill, secondary = outlined, tertiary = text link. If "Contact us" is a filled emerald pill in the nav, it's a filled emerald pill in the footer and on every service page too — no quiet drift.
- **Minimum 44×44px touch targets** on mobile for every interactive element (buttons, nav links, form fields, dropdown selects) — Apple HIG / Material's standard, and a concrete, testable number for the design phase to hit.
- **Visible focus states on every interactive element** — a clear outline/ring for keyboard navigation. Default browser resets often strip this; it has to be added back deliberately, not assumed.
- **Loading/disabled state on the contact form's submit button.** Without one, a user who isn't sure their click registered will click again — a real, common cause of duplicate inquiries hitting a broker's inbox.

## 6. Fast loading

Photography carries this whole site (property photos, service imagery, the hero) — image performance *is* site performance here.

- **Treat load time as a hard budget**: target Largest Contentful Paint under 2.5s on a mid-tier mobile connection. This is a real Core Web Vital with both SEO and conversion impact, not a vague aspiration.
- **Every property/listing photo goes through an image pipeline**: responsive sizes, modern formats (WebP/AVIF), lazy-loaded below the first viewport. Non-negotiable once `/properties` has real inventory with real photos.
- **`font-display: swap` (or the framework's equivalent) for both EB Garamond and Inter** — text should never be invisible while a font loads. Matters most for the renter journey, where speed-to-message determines who gets the reply.
- **Defer the Messenger widget script** — load it lazily or on first interaction rather than letting it block the initial page render; chat-widget scripts are frequently the heaviest third-party asset on a page.
- Philippine mobile networks are less consistently fast than premium markets assume — this isn't a nice-to-have, it's core UX for the actual audience, especially the renter and OFW journeys where every second of delay has a cost.

## 7. Accessibility

- **WCAG 2.1 AA as the baseline target**, tested, not assumed — for a brand explicitly selling "trusted, established, secure," accessibility is itself a trust signal, not a separate checkbox.
- **Meaningful alt text on property photos specifically** — these are content, not decoration ("3-bedroom house exterior with covered carport," not empty `alt=""` or a generic "property photo"). A screen-reader user should be able to understand a listing from its text alone.
- **Forms use real labels, and errors are announced to screen readers, not conveyed by color alone.** The contact form is the conversion surface for all 6 journeys — it cannot silently fail a user who can't see a red border.
- **Any property map embed needs a text address alongside it**, not the pin alone — screen readers and compatibility both depend on it.
- **Verify palette contrast before the design phase locks visuals** (see Typography above) — cheaper to fix a token now than 40 built components later.

## 8. Mobile responsiveness

**The research gap we own outright**: the entire 8-site design audit was desktop-only (~1280px); mobile/responsive behavior was explicitly never tested, despite Philippine web traffic skewing heavily mobile. Nothing "desktop-validated" in the earlier research can be assumed to transfer — this category gets designed fresh, not inherited.

- **Design mobile-first, not desktop-then-shrink.** Three of six journeys (local buyer, renter, OFW) are explicitly mobile-dominant per `user-journeys.md`.
- **The persistent nav-embedded search needs its mobile treatment specified at design time, explicitly** — the easiest way to silently lose the audit's top-rated pattern is for it to get deprioritized under a cramped mobile header and quietly become hero-only again.
- **Test on real mid-range Android devices and realistic network conditions**, not just a desktop browser's responsive-mode simulator — the Philippine market skews Android, not premium iPhone, and simulators don't reproduce real mobile network variability.

---

## If prioritizing by friction-reduced-per-effort

1. **Persistent, mobile-safe nav search** — already the single highest-value item from the competitive research; the risk is losing it quietly during mobile design, not deciding against it outright.
2. **One button style + 44px touch targets, used everywhere** — cheap to specify now, expensive to retrofit across dozens of components later.
3. **Contrast-check the navy/emerald/porcelain palette** — a 30-minute check now versus rebuilding components later if it fails.
4. **Image pipeline for property photos** — the single biggest lever on load time, and directly blocks nothing else (can be specified in parallel with everything above).
5. **Mobile-first testing on real Android devices** — the research explicitly can't tell us this works; it has to be verified independently rather than assumed inherited from "the pattern that worked for competitors."
