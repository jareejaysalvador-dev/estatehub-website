# EstateHub.ph — Accessibility Spec

*Part of the planning series (`research-synthesis.md` → `sitemap.md` → `user-journeys.md` → `ux-recommendations.md` → `ui-design-system.md` → `responsive-design-spec.md` → this). WCAG 2.1 AA is the locked baseline; this spec makes it concrete and testable across the six areas below, plus cross-cutting structure. Planning only — the testing checklist at the end joins the build-phase gate alongside the responsive checklist.*

**This spec produced two user-approved amendments to the locked design system** (both WCAG 1.4.11 non-text-contrast failures caught by re-checking the computed ratios): the focus ring is now **Deep Emerald `#178A57` on light surfaces / Emerald or Mint on dark** (plain Emerald on Porcelain is 2.4:1 — fails the 3:1 indicator minimum), and **form-input borders use Slate `#5B6B82` on light surfaces** (the decorative card hairline is far under 3:1 and may not serve as a field boundary). Both are recorded in `ui-design-system.md`.

---

## 1. Keyboard navigation

- Every interactive element operable with Tab / Shift+Tab / Enter / Space / Esc / arrows; **no positive `tabindex`**, DOM order = visual order.
- **Skip-to-content link** — first focusable element, visible on focus (matters with a sticky header + nav search on every page).
- **Services dropdown:** opens on click and Enter/Space (already spec'd click-not-just-hover), arrows move within, Esc closes and returns focus to the trigger.
- **Mobile menu panel:** focus trapped while open, Esc closes, focus returns to the hamburger.
- **Property gallery:** prev/next as real buttons + arrow-key support — never swipe-only (swipe-only galleries are unusable by keyboard and many assistive-tech users).
- **Sticky elements** (header, phone inquiry bar) must never obscure the focused element — `scroll-margin` on focus targets sized to the sticky heights (WCAG 2.4.11).
- Messenger widget reachable by keyboard; its deferred load must never steal focus.
- **Acceptance test:** complete every journey's full path (search → filter → detail → inquire → submit; each service page → contact) with keyboard alone.

## 2. Sufficient color contrast

Binding rules from the computed ratios in `ui-design-system.md`, plus the two amendments above:

- Body text: Ink-on-Porcelain 16.9:1, Porcelain-on-Navy 15.6:1 — both AAA.
- Muted text on light = Slate `#5B6B82` (4.85:1) — never lighter grays.
- **Never Emerald as body-size text on Porcelain (2.4:1)**; Deep Emerald for large/bold only (3.9:1).
- **Button text on Emerald fill is always Ink (7.1:1), never white/porcelain (2.4:1).**
- Focus rings and input borders per the amendments.
- Status badges over photos always sit on a solid/scrimmed chip — text directly over photography can't guarantee any ratio.
- Nothing conveyed by color alone: errors get icon + text; links inside prose get underlines, not color-only.
- Error red `#B3402E` on Porcelain ≈ 5.1:1 — passes for text; re-verify against built components.

## 3. Alt text for images

- **Property photos are content, not decoration**: descriptive alt per image ("3-bedroom house exterior with covered carport"), including every gallery image; never "photo of"/"image of" prefixes; a listing must be understandable from text alone.
- Broker photos: alt = broker's name. Logo link: alt "EstateHub.ph — home".
- Atmospheric hero imagery with a scrim and overlaid headline: decorative, `alt=""` — the headline carries the meaning. If the hero shows a specific property, describe it.
- Decorative icons `aria-hidden="true"`; icon-only controls (search, hamburger, close, gallery arrows) each get an `aria-label`.
- Map embeds always paired with the text address (already locked).

## 4. Clear labels for forms

- Visible label above every input (locked), programmatically associated (`for`/`id`); placeholder never a label.
- Intent selector = radio group in a `fieldset` with a `legend`.
- Mark the exception: "(optional)" on optional fields (locked pattern).
- Errors: icon + Error red + explanatory text; `aria-invalid` on the field, error text linked via `aria-describedby`; on submit-with-errors, focus moves to an error summary whose items link to their fields.
- `autocomplete` attributes on name/email/tel (locked; also WCAG 1.3.5).
- Async submit announced to screen readers: `aria-live="polite"` region for "Sending…" and the success/failure result — a sighted-only spinner is half a feature.

## 5. Focus indicators

- Visible on **every** interactive element — never `outline: none` without a replacement.
- Spec: 2px ring, 2px offset; **Deep Emerald on light surfaces, Emerald/Mint on dark** (amendment #1).
- Use `:focus-visible` so keyboard users always see it; never suppress on the assumption "mouse users don't need it."
- Skip link, nav search, sticky-bar buttons, gallery controls, Messenger launcher — all included; the sticky inquiry bar's buttons must show rings fully (no clipping by the bar's edges).

## 6. Readable font sizes

- 16px body floor (locked); small text 13–14px at weight 500 for meta/captions only — nothing below 13px anywhere.
- EB Garamond only at headline sizes (locked) — serif at small sizes is a legibility cost, which is exactly why it's restricted.
- All sizing in `rem` so browser text-size settings work; **200% zoom must not break layout or hide content** (WCAG 1.4.4) and the page must reflow at 320px CSS width without horizontal scrolling (1.4.10 — the 360px-first responsive spec nearly guarantees this; test at 320px anyway).
- **Never disable user zoom** — no `maximum-scale=1` / `user-scalable=no` in the viewport meta.

## Cross-cutting (beyond the six, cheap and high-value)

- Semantic structure: one `h1` per page, no skipped heading levels, landmark regions (`header`/`nav`/`main`/`footer`) — the free win for screen-reader navigation.
- `lang="en"` on the document; any Filipino-language strings marked with `lang="fil"` spans.
- `prefers-reduced-motion` collapses all reveals/transitions to instant (already a motion-system mandate; restated here as the a11y requirement it also is).
- 44×44px touch targets (locked) double as WCAG 2.5.8 compliance.

## Testing checklist (joins the build-phase gate alongside the responsive checklist)

- [ ] Keyboard-only completion of every journey path, both mobile and desktop layouts
- [ ] Screen-reader smoke test: NVDA (free, Windows) on desktop + TalkBack on the real Android test device — nav, one listing, the contact form end-to-end
- [ ] Automated scan (axe / Lighthouse a11y) clean on every launch page — treated as a floor, not the bar
- [ ] 200% zoom and 320px reflow pass on every launch page
- [ ] Reduced-motion mode verified
- [ ] Contrast spot-checks of built components against the binding table (including the two amended tokens)
