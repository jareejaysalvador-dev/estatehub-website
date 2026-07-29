# EstateHub.ph — UI Design System

*Turns the prior decisions (`research-synthesis.md`, `sitemap.md`, `user-journeys.md`, `ux-recommendations.md`, and the taste-skill brief-inference read — `DESIGN_VARIANCE: 7 / MOTION_INTENSITY: 4 / VISUAL_DENSITY: 4`) into concrete, buildable tokens and component rules. Planning only — this is the specification the design/build phases would work from, not the design or build itself. No component code, no page layouts here.*

**Confirmed by the user:** the archived first build was dark-only everywhere; this system instead uses **porcelain (light) as the default for content pages, with navy reserved for the hero, nav, footer, and deliberate high-impact moments** — not a user-facing light/dark toggle, just where each color lives structurally. With 11+ content-heavy pages (forms, policies, service explanations, listings), an all-navy site would fight the "established, readable, not flashy" brief and fatigue on long reads. Everything below assumes this split; it is settled.

---

## 1. Color theory

**Roles, not just hex values** — every color has exactly one job:

| Token | Hex | Role |
|---|---|---|
| Porcelain | `#F5F2EB` | Dominant surface — content page backgrounds, cards on dark sections |
| Midnight Navy | `#0E1A2C` | Structural dark — nav, footer, hero, one "trust statement" band per major page |
| Deep Ink | `#091120` | Darkest — hero photo scrim, deepest backgrounds, **body text color on porcelain** |
| Emerald | `#22B573` | The one accent — primary buttons, active states, icons on dark backgrounds |
| Deep Emerald | `#178A57` | Emerald's readable-on-light twin — large text/links on porcelain, hover state for emerald fills |
| Mint | `#8FDCBD` | Emerald tint — hover state (lightening direction), secondary text on dark |
| Slate (new, this doc) | `#5B6B82` | Muted/secondary text **on porcelain** — verified AA-passing (below) |
| Error (new, this doc) | `#B3402E` | Form validation only. A muted brick, not a pure red — doesn't clash with navy/emerald |

Roughly **60% porcelain / 30% navy-ink / 10% emerald** across a full page scroll — not a rigid ratio, but the direction: navy is a deliberate, occasional dramatic move (hero, footer, one band), not the default canvas.

**One accent, no exceptions** — emerald (or its Deep Emerald variant on light backgrounds) is the *only* color that means "act here." Never recolor a secondary button emerald; never introduce a second accent hue. This is literally what the competitive research found separates the professional-reading sites from the cluttered ones.

## 2. Typography

Two typefaces doing distinct jobs, not three competing ones — Montserrat stays wordmark-only (unchanged), so in practice: **EB Garamond for one moment per page, Inter for everything else.**

| Level | Font | Size (desktop / mobile) | Weight | Line-height |
|---|---|---|---|---|
| H1 (hero/page title) | EB Garamond | 44px / 32px | 500 | 1.15 |
| H2 (section header) | Inter | 28px / 22px | 700 | 1.25 |
| H3 (card/subsection title) | Inter | 20px / 18px | 600 | 1.3 |
| Body large (intros) | Inter | 18px | 400 | 1.6 |
| Body (default) | Inter | 16px | 400 | 1.6 |
| Small (meta, captions, legal) | Inter | 13–14px | 500 | 1.5 |
| Button / UI label | Inter | 15–16px | 600 | 1 |

- **EB Garamond appears once per page** (the H1) — per `ux-recommendations.md`, never at H2 or smaller. This is the whole reason it was chosen; diluting it into a general heading font erases the signal.
- Paragraphs capped at **~65 characters** measure, never full-bleed across the 1280px container.
- Tabular figures (`font-variant-numeric: tabular-nums`) wherever numbers align in a column — prices, specs, phone numbers.

## 3. White space

- **Spacing scale** (one scale, no arbitrary values): `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96` px.
- **Section vertical padding:** 64–96px desktop / 48px mobile between major sections on content pages; tighter (32–48px) on data-dense pages like `/properties`.
- **Card internal padding:** 24px desktop / 16px mobile, identical across every card type (property, service, broker, trust).
- **White space as emphasis, not just tidiness:** the single primary CTA per section gets deliberately more surrounding space than neighboring elements — isolation is how "this is the one thing to do here" reads visually, reinforcing the one-CTA-per-section rule from the UX doc.

## 4. Contrast

Verified with the actual WCAG relative-luminance formula, not assumed:

| Pair | Ratio | Passes |
|---|---|---|
| Porcelain text on Navy (hero/dark sections) | **15.6:1** | AAA, easily |
| Deep Ink text on Porcelain (body, light sections) | **16.9:1** | AAA, easily |
| Slate (`#5B6B82`) muted text on Porcelain | **4.85:1** | AA normal text ✓ |
| Deep Emerald text on Porcelain | **3.9:1** | AA large text/UI only — **not** body-size |
| Emerald text on Porcelain | **2.4:1** | **Fails**, even for large text |
| Ink text on Emerald button fill | **7.1:1** | AAA |
| Porcelain text on Emerald button fill | **2.4:1** | **Fails** — don't do this |
| Emerald on Navy (icons/links on dark) | **6.6:1** | AAA |

Three concrete rules follow directly:
1. **Never set Emerald as small text color on Porcelain** (links, labels) — use Deep Emerald for large/bold instances, or Deep Ink with an Emerald underline/icon accent for body-size links on light backgrounds.
2. **Button text on an Emerald fill is always Deep Ink, never light/porcelain** — the reverse fails outright.
3. On dark sections, Emerald is safe as text/icon color directly — the light/dark split isn't symmetric, and that's fine, just needs to be known rather than assumed.

## 5. Alignment

- **Left-align body text always** — never justified (uneven word-spacing, worse for Inter at body sizes).
- **Right-align numbers** in any comparison context (price columns, spec sheets) so digits stack cleanly — pairs with the tabular-figures rule above.
- **Icon+label pairs share a center or baseline**, never a slight visual float — applies to nav items, spec rows (bed/bath/sqm), button icons.
- **Centering is a deliberate exception, not a default** — used only for isolated closing-CTA moments; everything else follows the left-aligned grid below.

## 6. Grid systems

- **Container:** max-width 1280px, centered, 24px side padding on mobile, up to 48px on desktop.
- **Breakpoints:** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` (standard, nothing exotic — no reason to diverge here).
- **Column grid:** 12 columns ≥1024px, 4 columns 768–1023px, single column below 768px.
- **Applied specifically:**
  - Property listing grid: 3 columns desktop → 2 tablet → 1 mobile.
  - Service/trust cards: 2–3 columns desktop depending on count → 1 mobile, never a forced 3-across that leaves an orphaned card.
  - Forms: single column on mobile, always; short paired fields (first/last name) may sit 2-across on desktop only.

## 7. Icons

- **Library: Phosphor (`@phosphor-icons/react`)** — carried over from the taste-skill's own priority order (Phosphor → HugeIcons → Radix → Tabler; Lucide discouraged as default). No reason to reopen this; nothing about the restart changes it.
- **One weight, everywhere:** `light` — reads refined rather than bold/generic, consistent with the "established, not playful" brief.
- **Functional only** — search, phone, mail, bed/bath/area, chevrons, Messenger. No decorative icon clutter.
- **Icon-only controls need `aria-label`** unconditionally (hamburger, close, carousel arrows) — ties directly to the accessibility item in `ux-recommendations.md`.
- **Size scale:** 16px inline with text, 20px standalone in a button, 24px max for any decorative/feature use.

## 8. Button states

One button per action-type, every state specified — a button that only has a "default" look is unfinished:

| State | Primary (filled) | Secondary (outline) | Text link |
|---|---|---|---|
| Default | Emerald fill, Ink text | Transparent, Emerald border+text (light bg) / Porcelain (dark bg) | Deep Emerald (light bg) / Mint (dark bg), underline |
| Hover | **Mint** fill (lightens) | 8–10% tint fill behind border | Underline thickens |
| Active/pressed | **Deep Emerald** fill (darkens) | Slightly deeper tint | Color deepens one step |
| Focus (keyboard) | 2px ring, 2px offset — **Deep Emerald on light surfaces, Emerald/Mint on dark** *(user-approved amendment: plain Emerald on Porcelain is 2.4:1, failing WCAG 1.4.11's 3:1 indicator minimum; Deep Emerald passes at 3.9:1)* | Same ring | Same ring, even on plain text |
| Disabled | 40% opacity, `cursor: not-allowed` | Same | Same |
| Loading | Spinner + label change ("Sending…"), interaction blocked | — | — |

The hover/active progression (Emerald → Mint on hover → Deep Emerald on press) uses only colors already in the palette — no new hues invented for state changes.

## 9. Cards

- **One shape system, sitewide:** cards `16px` corner radius, buttons full pill, inputs `8px` — three tiers, applied consistently, never mixed arbitrarily (a square card with pill buttons inside is intentional; a mix of card radii is not).
- **Flat by default** — hairline border (on-brand, "trust" reads as understated, not a heavy drop-shadow system). Shadow appears only as a hover-state cue on clickable cards, not at rest.
- **Card anatomy per type** (content varies, structure doesn't):
  - *Property card:* image (4:3), status badge (For Sale/For Lease) overlaid top-left, price (bold, large), title, spec row (bed/bath/sqm, right-aligned numerals), one CTA.
  - *Service card:* icon or image, H3 label, one-line description, one text-link CTA.
  - *Broker card:* photo, name, PRC license number, contact icons (phone/email/Messenger).
  - *Trust/feature card:* icon, label, one-line supporting detail — no CTA, these are Evaluate-stage, not Contact-stage.
- **Clickable-card hover:** border shifts to Emerald, subtle lift (shadow appears), image slight scale — motivated by "this is interactive," not decoration for its own sake.

## 10. Forms

The highest-stakes surface on the site — every one of the 6 user journeys converts here.

- **Input borders use Slate `#5B6B82` on light surfaces** *(user-approved amendment: the decorative card hairline is far under WCAG 1.4.11's 3:1 boundary minimum on Porcelain; Slate passes at 4.85:1. The hairline remains for cards only — decorative, not a control boundary).*
- **Labels above inputs, always.** Never placeholder-as-label — a label that disappears once typing starts is a known, well-documented usability failure.
- **Mark the exception, not the rule:** if most fields are required, label the few optional ones "(optional)" rather than asterisking every required field.
- **Validation on blur or submit, never mid-keystroke** — don't tell someone their email is invalid after their third character.
- **Errors: icon + Error red (`#B3402E`) + explanatory text, never color alone** — "Enter a valid email address," not "Error" or a bare red border.
- **The Contact form specifically must surface** (per `user-journeys.md`): an intent selector (buy/rent/sell/manage/business/overseas) as a visible select or radio group — not buried in a free-text message box — a property-reference field auto-filled when arriving from a listing, preferred-channel choice (Messenger/email/phone), and a preferred-time-plus-timezone field for the OFW journey.
- **Mobile:** single column always; every input, select, and checkbox meets the 44×44px touch-target minimum from `ux-recommendations.md`.
- **Submit button:** full-width on mobile (thumb-friendly), states per the Button States table above — loading state is mandatory here specifically, since a duplicate inquiry from an impatient re-click is a real, observed failure mode.

---

## What's now fully specified vs. still open

**Specified, ready to build from:** the porcelain-forward surface split (user-confirmed), color roles + verified contrast pairs, full type scale, spacing scale, grid/breakpoints, icon library + rules, complete button state matrix, card shape system, form field rules.

**Still open:** nothing — this system is fully locked. Changes from here require an explicit user decision, not silent revision during design or build.

**Amendment log:** two user-approved contrast corrections from `accessibility-spec.md` planning — (1) focus ring color split by surface (Deep Emerald on light / Emerald-Mint on dark), (2) input borders use Slate on light surfaces, hairline demoted to cards-only. Both are marked inline above.
