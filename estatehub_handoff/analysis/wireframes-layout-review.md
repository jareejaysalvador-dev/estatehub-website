# EstateHub.ph — Wireframes / Layout Review

*A retrospective structural audit against the site as built, through the four lenses Nami's Phase 4 specifies: Layout, Hierarchy, Spacing, Navigation. This is not a redesign - the site is already built, QA'd, and shipped through Stage 5. Where Stage 5's `qa-report.md` already verified something (contrast, focus rings, keyboard nav, the 320px reflow sweep), this doc cross-references it rather than re-deriving it. What's new here is checked directly against the codebase, not asserted from memory.*

## Method

Every launch page reviewed against:
- **Layout** — is the structural shape (grid/flex composition) distinct where it should be, and consistent where it should be?
- **Hierarchy** — is there exactly one dominant element per page, and does EB Garamond stay reserved for it?
- **Spacing** — one scale, used consistently, no arbitrary one-off values.
- **Navigation** — can a user always tell where they are and get back out?

**Spacing claim verified directly**: a codebase-wide grep for arbitrary margin/padding/gap values (`m-[`, `p-[`, `gap-[`, etc.) returned zero matches. Every spacing value in `src/` comes from Tailwind's default scale via its standard utilities - there is no one-off spacing anywhere to flag.

## Page-by-page

### Home
- **Layout**: 7 sections, 7 genuinely distinct compositions - navy asymmetric hero split, a plain centered statement band, an asymmetric 4-cell services bento, a horizontal scroll-snap carousel, a second navy split (Overseas), a 12-column asymmetric list-row section (Why EstateHub), and a closing CTA band. This is the one page where "distinct layout family per section" actually matters, since it's the only page a first-time visitor scrolls end-to-end - confirmed it doesn't repeat the same card-grid shape twice.
- **Hierarchy**: one H1 (Hero), all other headings are Inter H2/H3. EB Garamond appears exactly once.
- **Spacing**: consistent `py-16 lg:py-24`-family section rhythm throughout.
- **Navigation**: sticky header with skip link as the first focusable element (verified in Stage 5).

### Properties (listing)
- **Layout**: filter bar + result grid - one layout family, which is correct here. A listing page's job is fast scanning, not variety; the earlier competitive research flagged Homes & Land's missing above-the-fold search as the audit's single biggest gap, and this page's filter bar is the direct answer to that.
- **Hierarchy**: H1 "Properties" is the only display-serif element on the page; result count and cards read as body content beneath it.
- **Spacing**: consistent card grid gaps, no drift from the rest of the site's card padding.
- **Navigation**: reachable from the header's persistent nav-embedded search (the pattern the research called the single best interaction-design finding across all 8 competitor audits) - no breadcrumb needed at this depth.

### Property detail (`/properties/[slug]`)
- **Layout**: two-column at desktop (gallery + specs / agent block), single column at phone with a sticky bottom Inquire bar - an intentional asymmetric split, not equal panels, since the agent block is a secondary rail next to the primary content.
- **Hierarchy**: status pill → price → H1 (title) → location → grouped specs. Price sits above the title deliberately - on a real-estate listing, price is what a visitor scans for first, more than the property's name.
- **Spacing**: spec clusters are grouped rather than bordered-every-row (an explicit build-time decision to avoid a busy, over-divided look).
- **Navigation**: breadcrumb (Home › Properties › [title]) plus a mobile-only back link - both added during Stage 5 QA specifically because this category was flagged as missing.

### Services ×4 (shared template)
- **Layout**: one shared template across all four - correct, since these are parallel content types (same job, different service), and a shared template is what keeps their information architecture comparable rather than each one drifting independently.
- **Hierarchy**: eyebrow (service label) → H1 (hero line) → intro → CTA → numbered "How it works" steps → "Who this is for" → FAQ. Exactly one eyebrow, one H1, matching the ≤1-eyebrow-per-page budget.
- **Spacing**: consistent `mt-14 lg:mt-20` between every section across all four pages.
- **Navigation**: breadcrumb (Home › Services › [service]) added during Stage 5 QA; the Sales and Property Management pages cross-link to `/overseas`, Lease and Business Solutions correctly don't (verified during the build).

### Overseas
- **Layout**: navy hero (the site's second "structural moment," matching Home's first) → numbered remote-process steps → trust points.
- **Hierarchy**: one H1 in the navy hero band; everything else is Inter.
- **Navigation**: reachable from the header's persistent nav, and from the two service pages where it's actually relevant (Sales, Property Management) rather than force-linked from all four.

### About
- **Layout**: intro → three-principle section → broker roster → closing CTA. The principles section was a genuine layout defect until Stage 5 QA caught it: it was originally three equal bordered cards (`grid-cols-1 md:grid-cols-3`), exactly the generic pattern the build's own rules warn against. It's now divided rows (icon + title + detail, hairline dividers, no card chrome) - the same pattern `WhyEstateHub` already uses on the homepage for the same content shape, so the two "why trust us" moments on the site now read as one consistent visual language instead of two different ones.
- **Hierarchy**: one H1, clean.
- **Spacing**: consistent `mt-14 lg:mt-20`.
- **Navigation**: no breadcrumb, correctly - About is a standalone top-level destination, not part of a deeper collection the way `/properties/[slug]` or `/services/*` are.

### Contact
- **Layout**: asymmetric two-column at desktop (form + a narrower aside for other contact methods), single column at phone - the form is the primary content, so it correctly gets the wider column rather than an even 50/50 split.
- **Hierarchy**: one H1, form below it.
- **Navigation**: reachable via the single sitewide CTA on every page - by design there is no competing route to this page, since "Contact us" is the one CTA label used everywhere.

### Privacy / Terms
- **Layout**: single narrow column, `max-w-3xl` rather than the `max-w-7xl` most other pages use - a deliberate width reduction, since this is dense reading text and a narrower measure keeps line length in the readable range rather than stretching legal copy edge-to-edge.
- **Hierarchy**: H1, an explicit "draft pending legal review" notice, then H2-sectioned body copy.
- **Navigation**: reachable only from the footer, correctly - these are utility pages, not primary destinations, so they don't compete for header nav space.

### 404
- **Layout**: single narrow column - eyebrow ("404") → H1 → body copy → search → three recovery links (Home, Properties, Contact).
- **Hierarchy**: the one page where an eyebrow-plus-H1 pairing is justified as more than decoration - "404" functions as a genuine status label, not a stylistic kicker.
- **Navigation**: the search form and three links exist specifically so a lost visitor has an actual way out, not just an apology.

## Cross-cutting patterns

- **Shape system**: 16px card radius, full-pill buttons, 8px inputs - a Stage 5 grep already found zero stray radii outside this system; this review found nothing to add.
- **One eyebrow budget, respected everywhere**: 404 and the four service pages carry exactly one each; every other page carries zero. No page exceeds the ≤1 budget.
- **No page reuses a "3 equal cards" shape** anymore - the one instance that did (About's principles) is fixed. Nothing else in the codebase matches that pattern (confirmed by extension of the fix's grep - it was the only place with a bare `grid-cols-1 md:grid-cols-3` wrapping bordered cards with icon+title+detail content).

## Verdict

No new layout defects found beyond what Stage 5 QA already caught and fixed (the horizontal-overflow bug and the 3-card pattern, both already committed). Navigation gaps that existed (active nav-state, service breadcrumbs) were also already found and fixed in Stage 5. This review's value-add over the existing QA report is the explicit page-by-page hierarchy/spacing rationale above, and the direct verification that no arbitrary spacing values exist anywhere in the codebase.
